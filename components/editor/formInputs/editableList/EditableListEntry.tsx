import React, { useState } from 'react'
import DragHandle from './DragHandle'
import { GraphQLField, GraphQLNamedType } from 'graphql/type/definition'
import Field from '../../form/Field'
import ReorderHandle from './ReorderHandle'
import LineCenteredElement from '../../../LineCenteredElement'
import IconButton from '../../../IconButton'
import { Actions, Size } from '../../../StyledButtonEnums'
import { classNames } from '../../../lib/styling'

interface EditableListEntryProps extends DragItemProps {
  fieldType: GraphQLNamedType
  fieldName: string
  field: GraphQLField<any, any>
  isRequired: boolean
  data: any
  handleChildDataChangeRequest: (id: number, childData: any) => void
  removeButtonEventHandler: (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number,
  ) => void
  onDragStartHandler: (idDraggedEntry: number) => void
  onDragOverHandler: (idHoveredEntry: number) => void
  onDragEndHandler: () => void
  showDragHandles: boolean
  moveUpHandler: (id: number) => void
  moveDownHandler: (id: number) => void
}

interface DragItemProps {
  id: number
  listIndex: number
}

/** Visualizes an entry in data of an array content type field */
const EditableListEntry: React.FC<EditableListEntryProps> = (
  props: EditableListEntryProps,
) => {
  const [isDndHandlePointerDown, setIsDndHandlePointerDown] =
    useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  return (
    <div
      className={classNames('flex', isDragging ? 'invisible' : '')}
      draggable={isDndHandlePointerDown}
      onDragStart={(event) => {
        event.stopPropagation()
        setIsDragging(true)
        props.onDragStartHandler(props.id)
      }}
      onDragOver={(event) => {
        props.onDragOverHandler(props.id)
      }}
      onDragEnd={(event) => {
        event.stopPropagation()
        setIsDndHandlePointerDown(false)
        setIsDragging(false)
        props.onDragEndHandler()
      }}
    >
      {props.showDragHandles && (
        <DragHandle pointerDownChangedHandler={setIsDndHandlePointerDown} />
      )}
      {!props.showDragHandles && (
        <ReorderHandle
          id={props.id}
          moveUpHandler={props.moveUpHandler}
          moveDownHandler={props.moveDownHandler}
        />
      )}

      {/* grid is required to provide proper width constraints to extra-wide child elements */}
      <div className={'flex-grow grid grid-cols-1'}>
        <LineCenteredElement>
          <IconButton
            iconName={'XMarkIcon'}
            actionType={Actions.neutral}
            className={'text-red-500'} // TODO maybe add a button outline style instead and then use Actions.negative?
            size={Size.sm}
            onClick={(event) => {
              props.removeButtonEventHandler(event, props.listIndex)
            }}
          />
        </LineCenteredElement>

        <Field
          fieldType={props.fieldType}
          fieldName={props.fieldName}
          field={props.field}
          isRequiredField={props.isRequired}
          data={props.data}
          handleChildDataChangeRequest={(childName: string, childData: any) => {
            props.handleChildDataChangeRequest(props.id, childData)
          }}
        />
      </div>
    </div>
  )
}

export default EditableListEntry
