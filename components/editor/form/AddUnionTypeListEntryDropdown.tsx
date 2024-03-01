import React from 'react'
import { GraphQLUnionType } from 'graphql/type/definition'
import { GraphQLObjectType } from 'graphql/type'
import LineCenteredElement from '../../LineCenteredElement'
import DropDown from '../../DropDown'
import { Actions } from '../../StyledButtonEnums'
import IconButton, { IconPosition } from '../../IconButton'
import { DropDownEntryProps } from '../../DropDownEntry'

interface AddUnionTypeListEntryDropdownProps {
  unionType: GraphQLUnionType
  handleAddButtonEvent: (fieldTypeToAdd: GraphQLObjectType) => void
}

const AddUnionTypeListEntryDropdown: React.FC<
  React.PropsWithChildren<AddUnionTypeListEntryDropdownProps>
> = (props: React.PropsWithChildren<AddUnionTypeListEntryDropdownProps>) => {
  const menuButton = (
    <IconButton
      iconName={'ChevronDownIcon'}
      actionType={Actions.neutral}
      iconPosition={IconPosition.succeeding}
    >
      Add {props.unionType.name}
    </IconButton>
  )

  const dropDownEntries: DropDownEntryProps[] = props.unionType
    .getTypes()
    .map((type) => {
      return {
        label: type.name,
        onClickHandler: (event) => {
          props.handleAddButtonEvent(type)
        },
      }
    })

  return (
    <LineCenteredElement>
      <DropDown customButton={menuButton} menuEntries={dropDownEntries} />
    </LineCenteredElement>
  )
}

export default AddUnionTypeListEntryDropdown
