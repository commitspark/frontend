import React, { useCallback, useMemo, useRef, useState } from 'react'
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
import update from 'immutability-helper'
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

interface ListEntryWithId {
  id: number
  value: unknown
}

const EditableListFormInput: React.FC<EditableListFormInputProps> = (
  props: EditableListFormInputProps,
) => {
  const currentInternalData = useRef<ListEntryWithId[]>([])
  const nextIdRef = useRef<number>(0)
  const { fieldName, handleChildDataChangeRequest } = props

  const syncFromProps = useCallback((data: unknown[] | null | undefined) => {
    const existingEntries = currentInternalData.current
    const newList: ListEntryWithId[] = []
    const usedIds = new Set<number>()

    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        const dataAtIndex = data[i]
        const existingEntryAtIndex = existingEntries[i]
        if (
          existingEntryAtIndex &&
          existingEntryAtIndex.value === dataAtIndex &&
          !usedIds.has(existingEntryAtIndex.id)
        ) {
          // unchanged at the same index -> keep id
          newList.push({ id: existingEntryAtIndex.id, value: dataAtIndex })
          usedIds.add(existingEntryAtIndex.id)
          continue
        }
        const found = existingEntries.find(
          (e) => e.value === dataAtIndex && !usedIds.has(e.id),
        )
        if (found) {
          // element was reordered -> preserve its id
          newList.push({ id: found.id, value: dataAtIndex })
          usedIds.add(found.id)
        } else {
          // new element
          newList.push({ id: nextIdRef.current++, value: dataAtIndex })
        }
      }
    }
    currentInternalData.current = newList
  }, [])

  // derive a stable list for rendering; recompute only when props.data identity changes
  const internalData: ListEntryWithId[] = useMemo(() => {
    syncFromProps(props.data as unknown[] | null)
    return currentInternalData.current
  }, [props.data, syncFromProps])

  // lets us check during drag events if the event is coming from an entry in this list
  const [idDraggedEntry, setIdDraggedEntry] = useState<number | null>(null)
  const childNamedType = getNamedTypeFromWrappingType(props.fieldType)

  const onDragOverHandler = useCallback(
    (idHoveredEntry: number): void => {
      // if the event comes from an entry in another (e.g. nested) list, ignore it
      if (idDraggedEntry === null) {
        return
      }

      const indexDraggedEntry = currentInternalData.current.findIndex(
        (listDatum) => listDatum.id === idDraggedEntry,
      )
      const indexHoveredEntry = currentInternalData.current.findIndex(
        (listDatum) => listDatum.id === idHoveredEntry,
      )
      currentInternalData.current = update(currentInternalData.current, {
        $splice: [
          [indexDraggedEntry, 1],
          [
            indexHoveredEntry,
            0,
            currentInternalData.current[indexDraggedEntry],
          ],
        ],
      })
    },
    [idDraggedEntry],
  )

  const dragStartHandler = useCallback((idDraggedEntry: number): void => {
    setIdDraggedEntry(idDraggedEntry)
  }, [])

  const dragEndHandler = useCallback((): void => {
    setIdDraggedEntry(null)
    handleChildDataChangeRequest(
      fieldName,
      currentInternalData.current.map((listDatum) => listDatum.value),
    )
  }, [fieldName, handleChildDataChangeRequest])

  const childDataChangeRequestHandler = useCallback(
    (id: number, childData: unknown): void => {
      const newData = [...currentInternalData.current]
      const indexChangedEntry = newData.findIndex(
        (listDatum) => listDatum.id === id,
      )
      newData[indexChangedEntry].value = childData
      handleChildDataChangeRequest(
        fieldName,
        newData.map((listDatum) => listDatum.value),
      )
    },
    [fieldName, handleChildDataChangeRequest],
  )

  function handleAddNamedTypeButtonEvent(): void {
    const extendedList = [...(props.data ?? [])]

    let newEntry = null
    if (isNonNullType(props.fieldType.ofType)) {
      newEntry = createDefaultData(props.fieldType.ofType, 1)
    }
    extendedList.push(newEntry)
    handleChildDataChangeRequest(fieldName, extendedList)
  }

  function handleAddUnionTypeButtonEvent(fieldType: GraphQLObjectType): void {
    const extendedList = [...(props.data ?? [])]

    let newEntry = null
    if (isNonNullType(props.fieldType.ofType)) {
      const defaultData = createDefaultData(fieldType, 1)
      assertIsRecordOrNull(defaultData)
      // we add GraphQL typing information so that a matching form can be generated;
      // we strip such extra data back out in commit.ts
      newEntry = { ...defaultData, __typename: fieldType.name }
    }
    extendedList.push(newEntry)

    handleChildDataChangeRequest(fieldName, extendedList)
  }

  const handleRemoveButtonEvent = useCallback(
    (_: React.MouseEvent<HTMLButtonElement>, listIndex: number): void => {
      const newListData = currentInternalData.current.filter(
        (value) => value.id !== listIndex,
      )
      const publicData = newListData.map((keyedEntry) => keyedEntry.value)

      handleChildDataChangeRequest(fieldName, publicData)
    },
    [fieldName, handleChildDataChangeRequest],
  )

  let adderWidget: React.ReactNode
  if (!isNonNullType(props.fieldType.ofType)) {
    adderWidget = (
      <AddNamedTypeListEntryButton
        typeNameLabel={'list entry'}
        handleAddButtonEvent={handleAddNamedTypeButtonEvent}
        size={Size.md}
      />
    )
  } else if (isScalarType(childNamedType)) {
    adderWidget = (
      <AddNamedTypeListEntryButton
        typeNameLabel={childNamedType.name}
        handleAddButtonEvent={handleAddNamedTypeButtonEvent}
        size={Size.md}
      />
    )
  } else if (isUnionType(childNamedType)) {
    adderWidget = (
      <AddUnionTypeListEntryDropdown
        unionType={childNamedType}
        handleAddButtonEvent={handleAddUnionTypeButtonEvent}
      />
    )
  } else {
    adderWidget = (
      <AddNamedTypeListEntryButton
        typeNameLabel={childNamedType.name}
        handleAddButtonEvent={handleAddNamedTypeButtonEvent}
        size={Size.md}
      />
    )
  }

  const moveEntry = useCallback(
    (internalIdEntryToMove: number, direction: number): void => {
      const indexEntryToMove = currentInternalData.current.findIndex(
        (listDatum) => listDatum.id === internalIdEntryToMove,
      )
      // constrain target to valid array range
      const indexTarget = Math.min(
        currentInternalData.current.length - 1,
        Math.max(0, indexEntryToMove + direction),
      )
      const updatedEntries = update(currentInternalData.current, {
        $splice: [
          [indexEntryToMove, 1],
          [indexTarget, 0, currentInternalData.current[indexEntryToMove]],
        ],
      })
      currentInternalData.current = updatedEntries

      handleChildDataChangeRequest(
        fieldName,
        updatedEntries.map((listDatum) => listDatum.value),
      )
    },
    [fieldName, handleChildDataChangeRequest],
  )

  const moveUpHandler = useCallback(
    (id: number) => moveEntry(id, -1),
    [moveEntry],
  )
  const moveDownHandler = useCallback(
    (id: number) => moveEntry(id, +1),
    [moveEntry],
  )

  return (
    <div className="p-4 form-input-ring">
      <div className="flex flex-col gap-y-8">
        {internalData.map((listDatum, index) => (
          <EditableListEntry
            fieldType={childNamedType}
            fieldName={index.toString()}
            field={props.field}
            isRequired={isNonNullType(props.fieldType.ofType)}
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
}

export default EditableListFormInput
