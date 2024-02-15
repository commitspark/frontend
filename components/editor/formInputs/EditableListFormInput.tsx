import React, { useCallback, useEffect, useRef, useState } from 'react'
import EditableListEntry from './editableList/EditableListEntry'
import {
  GraphQLObjectType,
  GraphQLType,
  isNonNullType,
  isScalarType,
  isUnionType,
} from 'graphql/type'
import AddNamedTypeListEntryButton from '../form/AddNamedTypeListEntryButton'
import { getNamedTypeFromWrappingType } from '../../lib/schema-utils'
import AddUnionTypeListEntryDropdown from '../form/AddUnionTypeListEntryDropdown'
import update from 'immutability-helper'
import { GraphQLField, GraphQLList } from 'graphql/type/definition'
import { createDefaultData } from '../../lib/default-data-generator'
import { assertIsRecordOrNull } from '../../lib/assert'
import LineCenteredElement from '../../LineCenteredElement'
import { Size } from '../../StyledButtonEnums'

interface EditableListFormInputProps {
  fieldType: GraphQLList<GraphQLType>
  fieldName: string
  field: GraphQLField<any, any>
  data: unknown[] | null
  handleChildDataChangeRequest: (childName: string, childData: any) => void
}

interface ListEntryWithId {
  id: number
  value: any
}

const EditableListFormInput: React.FC<EditableListFormInputProps> = (
  props: EditableListFormInputProps,
) => {
  const internalData: ListEntryWithId[] = generateListEntriesWithId(props.data)
  const currentInternalData = useRef<ListEntryWithId[]>(internalData)
  useEffect(() => {
    currentInternalData.current = generateListEntriesWithId(props.data)
  }, [props.data])

  // lets us check during drag events if the event is coming from an entry in this list
  const [idDraggedEntry, setIdDraggedEntry] = useState<number | null>(null)
  const childNamedType = getNamedTypeFromWrappingType(props.fieldType)

  // React needs a stable key for rendering lists, but we don't have a key, so we need to generate it
  function generateListEntriesWithId(data: any): ListEntryWithId[] {
    let idCounter = 0
    return (
      data?.map((element: any): ListEntryWithId => {
        const id = idCounter++
        return {
          id: id,
          value: element,
        }
      }) ?? []
    )
  }

  function getGreatestId(listData: ListEntryWithId[]): number {
    let greatestId = 0
    for (const listDatum of listData) {
      if (listDatum.id > greatestId) {
        greatestId = listDatum.id
      }
    }
    return greatestId
  }

  const onDragOverHandler = useCallback((idHoveredEntry: number): void => {
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
        [indexHoveredEntry, 0, currentInternalData.current[indexDraggedEntry]],
      ],
    })
  }, [])

  const dragStartHandler = useCallback((idDraggedEntry: number): void => {
    setIdDraggedEntry(idDraggedEntry)
  }, [])

  const dragEndHandler = useCallback((): void => {
    setIdDraggedEntry(null)
    props.handleChildDataChangeRequest(
      props.fieldName,
      currentInternalData.current.map((listDatum) => listDatum.value),
    )
  }, [props.fieldName])

  const handleChildDataChangeRequest = useCallback(
    (id: number, childData: any): void => {
      const newData = [...currentInternalData.current]
      const indexChangedEntry = newData.findIndex(
        (listDatum) => listDatum.id === id,
      )
      newData[indexChangedEntry].value = childData
      props.handleChildDataChangeRequest(
        props.fieldName,
        newData.map((listDatum) => listDatum.value),
      )
    },
    [props.fieldName],
  )

  function handleAddNamedTypeButtonEvent(): void {
    const extendedList = [...(props.data ?? [])]

    let newEntry = null
    if (isNonNullType(props.fieldType.ofType)) {
      newEntry = createDefaultData(props.fieldType.ofType, 1)
    }
    extendedList.push(newEntry)
    const nextId = getGreatestId(currentInternalData.current) + 1
    currentInternalData.current = [
      ...currentInternalData.current,
      {
        id: nextId,
        value: newEntry,
      },
    ]
    props.handleChildDataChangeRequest(props.fieldName, extendedList)
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

    const nextId = getGreatestId(currentInternalData.current) + 1
    currentInternalData.current = [
      ...currentInternalData.current,
      {
        id: nextId,
        value: newEntry,
      },
    ]
    props.handleChildDataChangeRequest(props.fieldName, extendedList)
  }

  const handleRemoveButtonEvent = useCallback(
    (_: React.MouseEvent<HTMLButtonElement>, listIndex: number): void => {
      const newListData = currentInternalData.current.filter(
        (value) => value.id !== listIndex,
      )
      const publicData = newListData.map((keyedEntry) => keyedEntry.value)

      currentInternalData.current = newListData
      props.handleChildDataChangeRequest(props.fieldName, publicData)
    },
    [props.fieldName],
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

  function moveEntry(internalIdEntryToMove: number, direction: number): void {
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

    props.handleChildDataChangeRequest(
      props.fieldName,
      updatedEntries.map((listDatum) => listDatum.value),
    )
  }

  const moveUpHandler = useCallback((id: number) => moveEntry(id, -1), [])
  const moveDownHandler = useCallback((id: number) => moveEntry(id, +1), [])

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
            handleChildDataChangeRequest={handleChildDataChangeRequest}
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
