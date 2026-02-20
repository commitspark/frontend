import React, { memo, useCallback, useMemo, useState } from 'react'
import EditableListEntry from './editableList/EditableListEntry'
import {
  GraphQLField,
  GraphQLList,
  GraphQLObjectType,
  GraphQLType,
  isNonNullType,
  isScalarType,
  isUnionType,
} from 'graphql'
import AddNamedTypeListEntryButton from '../form/AddNamedTypeListEntryButton'
import { getNamedTypeFromWrappingType } from '../../lib/schema-utils'
import AddUnionTypeListEntryDropdown from '../form/AddUnionTypeListEntryDropdown'
import { createDefaultData } from '../../lib/default-data-generator'
import { assertIsRecordOrNull } from '../../lib/assert'
import LineCenteredElement from '../../LineCenteredElement'
import { Size } from '../../StyledButtonEnums'

interface EditableListFormInputProps {
  fieldType: GraphQLList<GraphQLType>
  fieldName: string
  field: GraphQLField<unknown, unknown>
  data: unknown[] | null
  handleChildDataChangeRequest: (childName: string, childData: unknown) => void
}

interface EntryWithId {
  id: number
  value: unknown
}

let globalNextId = 0
function nextId(): number {
  return globalNextId++
}

function reconcile(
  incoming: unknown[] | null,
  existing: EntryWithId[],
): EntryWithId[] {
  if (!Array.isArray(incoming) || incoming.length === 0) {
    return []
  }

  const result: EntryWithId[] = []
  const usedIds = new Set<number>()

  for (let i = 0; i < incoming.length; i++) {
    const newValue = incoming[i]

    // entry position and value unchanged -> keep in place
    const existingEntryAtI = existing[i]
    if (
      existingEntryAtI &&
      existingEntryAtI.value === newValue &&
      !usedIds.has(existingEntryAtI.id)
    ) {
      result.push(existingEntryAtI)
      usedIds.add(existingEntryAtI.id)
      continue
    }

    // entry moved from another position -> preserve its id
    const found = existing.find(
      (entry) => entry.value === newValue && !usedIds.has(entry.id),
    )
    if (found) {
      result.push(found)
      usedIds.add(found.id)
      continue
    }

    // new entry
    result.push({ id: nextId(), value: newValue })
  }

  return result
}

/**
 * Reconcile that preserves keys positionally: when a child's *content* changed
 * (new object reference) but the array *structure* didn't (same length, same
 * positions), we keep existing ids and just update values. This prevents
 * unmount/remount (and therefore input focus loss) of entries whose nested
 * data was edited in-place.
 */
function reconcilePreservingKeys(
  incoming: unknown[],
  existing: EntryWithId[],
): EntryWithId[] {
  if (incoming.length !== existing.length) {
    // structural change (add/remove) – fall back to full reconcile
    return reconcile(incoming, existing)
  }

  let changed = false
  const result: EntryWithId[] = new Array(incoming.length)

  for (let i = 0; i < incoming.length; i++) {
    if (existing[i].value === incoming[i]) {
      result[i] = existing[i]
    } else {
      changed = true
      result[i] = { id: existing[i].id, value: incoming[i] }
    }
  }

  return changed ? result : existing
}

const EditableListFormInput: React.FC<EditableListFormInputProps> = memo(
  (props: EditableListFormInputProps) => {
    const { fieldType, fieldName, field, data, handleChildDataChangeRequest } =
      props

    const [listItems, setListItems] = useState<EntryWithId[]>(() =>
      reconcile(data, []),
    )
    const [previousData, setPreviousData] = useState(data)

    // Allow tracking the last array we propagated upward so we can recognize
    // our own changes echoing back from the parent
    const [lastPropagated, setLastPropagated] = useState<unknown[] | null>(null)

    if (data !== previousData) {
      setPreviousData(data)
      setListItems((current) => {
        if (data === lastPropagated) {
          return reconcilePreservingKeys(data ?? [], current)
        }
        return reconcile(data, current)
      })
    }

    const [idDraggedEntry, setIdDraggedEntry] = useState<number | null>(null)

    const childNamedType = getNamedTypeFromWrappingType(fieldType)

    const propagate = useCallback(
      (newItems: EntryWithId[]) => {
        const plainArray = newItems.map((e) => e.value)
        setLastPropagated(plainArray)
        handleChildDataChangeRequest(fieldName, plainArray)
      },
      [fieldName, handleChildDataChangeRequest],
    )

    const childDataChangeRequestHandler = useCallback(
      (id: number, childData: unknown): void => {
        setListItems((current) => {
          const idx = current.findIndex((e) => e.id === id)
          if (idx === -1 || current[idx].value === childData) {
            return current
          }
          const updated = [...current]
          updated[idx] = { ...updated[idx], value: childData }
          queueMicrotask(() => propagate(updated))
          return updated
        })
      },
      [propagate],
    )

    const moveEntry = useCallback(
      (id: number, direction: number): void => {
        setListItems((current) => {
          const from = current.findIndex((e) => e.id === id)
          if (from === -1) {
            return current
          }
          const to = Math.min(current.length - 1, Math.max(0, from + direction))
          if (from === to) {
            return current
          }
          const updated = [...current]
          const [moved] = updated.splice(from, 1)
          updated.splice(to, 0, moved)
          queueMicrotask(() => propagate(updated))
          return updated
        })
      },
      [propagate],
    )

    const moveUpHandler = useCallback(
      (id: number) => moveEntry(id, -1),
      [moveEntry],
    )
    const moveDownHandler = useCallback(
      (id: number) => moveEntry(id, +1),
      [moveEntry],
    )

    const dragStartHandler = useCallback((id: number): void => {
      setIdDraggedEntry(id)
    }, [])

    const onDragOverHandler = useCallback(
      (idHoveredEntry: number): void => {
        if (idDraggedEntry === null) {
          return
        }

        setListItems((current) => {
          const fromIdx = current.findIndex((e) => e.id === idDraggedEntry)
          const toIdx = current.findIndex((e) => e.id === idHoveredEntry)
          if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) {
            return current
          }
          const updated = [...current]
          const [moved] = updated.splice(fromIdx, 1)
          updated.splice(toIdx, 0, moved)
          return updated
        })
      },
      [idDraggedEntry],
    )

    const dragEndHandler = useCallback((): void => {
      setIdDraggedEntry(null)
      setListItems((current) => {
        queueMicrotask(() => propagate(current))
        return current
      })
    }, [propagate])

    const handleAddNamedTypeButtonEvent = useCallback((): void => {
      const extendedList = [...(data ?? [])]
      let newEntry = null
      if (isNonNullType(fieldType.ofType)) {
        newEntry = createDefaultData(fieldType.ofType, 1)
      }
      extendedList.push(newEntry)
      setLastPropagated(extendedList)
      handleChildDataChangeRequest(fieldName, extendedList)
    }, [data, fieldType, fieldName, handleChildDataChangeRequest])

    const handleAddUnionTypeButtonEvent = useCallback(
      (unionFieldType: GraphQLObjectType): void => {
        const extendedList = [...(data ?? [])]
        let newEntry = null
        if (isNonNullType(fieldType.ofType)) {
          const defaultData = createDefaultData(unionFieldType, 1)
          assertIsRecordOrNull(defaultData)
          newEntry = { ...defaultData, __typename: unionFieldType.name }
        }
        extendedList.push(newEntry)
        setLastPropagated(extendedList)
        handleChildDataChangeRequest(fieldName, extendedList)
      },
      [data, fieldType, fieldName, handleChildDataChangeRequest],
    )

    const handleRemoveButtonEvent = useCallback(
      (_: React.MouseEvent<HTMLButtonElement>, listIndex: number): void => {
        setListItems((current) => {
          const updated = current.filter((entry) => entry.id !== listIndex)
          queueMicrotask(() => propagate(updated))
          return updated
        })
      },
      [propagate],
    )

    const adderWidget = useMemo(() => {
      if (!isNonNullType(fieldType.ofType)) {
        return (
          <AddNamedTypeListEntryButton
            typeNameLabel={'list entry'}
            handleAddButtonEvent={handleAddNamedTypeButtonEvent}
            size={Size.md}
          />
        )
      }
      if (isScalarType(childNamedType)) {
        return (
          <AddNamedTypeListEntryButton
            typeNameLabel={childNamedType.name}
            handleAddButtonEvent={handleAddNamedTypeButtonEvent}
            size={Size.md}
          />
        )
      }
      if (isUnionType(childNamedType)) {
        return (
          <AddUnionTypeListEntryDropdown
            unionType={childNamedType}
            handleAddButtonEvent={handleAddUnionTypeButtonEvent}
          />
        )
      }
      return (
        <AddNamedTypeListEntryButton
          typeNameLabel={childNamedType.name}
          handleAddButtonEvent={handleAddNamedTypeButtonEvent}
          size={Size.md}
        />
      )
    }, [
      fieldType,
      childNamedType,
      handleAddNamedTypeButtonEvent,
      handleAddUnionTypeButtonEvent,
    ])

    return (
      <div className="p-4 form-input-ring">
        <div className="flex flex-col gap-y-8">
          {listItems.map((listDatum, index) => (
            <EditableListEntry
              fieldType={childNamedType}
              fieldName={index.toString()}
              field={field}
              isRequired={isNonNullType(fieldType.ofType)}
              data={listDatum.value}
              key={listDatum.id}
              id={listDatum.id}
              listIndex={listDatum.id}
              handleChildDataChangeRequest={childDataChangeRequestHandler}
              onDragStartHandler={dragStartHandler}
              onDragOverHandler={onDragOverHandler}
              onDragEndHandler={dragEndHandler}
              removeButtonEventHandler={handleRemoveButtonEvent}
              showDragHandles={false} // TODO turned off until drag & drop UX is improved
              moveUpHandler={moveUpHandler}
              moveDownHandler={moveDownHandler}
            />
          ))}
          <LineCenteredElement>{adderWidget}</LineCenteredElement>
        </div>
      </div>
    )
  },
)

EditableListFormInput.displayName = 'EditableListFormInput'

export default EditableListFormInput
