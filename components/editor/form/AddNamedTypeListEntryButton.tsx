import React from 'react'
import { Actions, Size } from '../../StyledButtonEnums'
import IconButton from '../../IconButton'

interface AddNamedTypeListEntryButtonProps {
  typeNameLabel: string
  handleAddButtonEvent: () => void
  size?: Size
}

const AddNamedTypeListEntryButton: React.FC<
  AddNamedTypeListEntryButtonProps
> = (props: AddNamedTypeListEntryButtonProps) => {
  return (
    <IconButton
      actionType={Actions.neutral}
      size={props.size !== undefined ? props.size : Size.sm}
      iconName={'PlusIcon'}
      onClick={props.handleAddButtonEvent}
    >
      Add {props.typeNameLabel}
    </IconButton>
  )
}

export default AddNamedTypeListEntryButton
