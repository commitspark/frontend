import React from 'react'
import DropDown, { OpenDirection } from '../../DropDown'
import { DropDownEntryProps } from '../../DropDownEntry'

interface FieldLabelProps {
  fieldName: string
  typeNameLabel: string
  isRequiredField: boolean
  offerRemoveAction: boolean
  removeEventHandler: () => void
}

const FieldLabel: React.FC<React.PropsWithChildren<FieldLabelProps>> = (
  props: React.PropsWithChildren<FieldLabelProps>,
) => {
  const dropDownEntries: DropDownEntryProps[] = []
  if (props.offerRemoveAction) {
    dropDownEntries.push({
      label: 'Remove',
      iconName: 'XMarkIcon',
      onClickHandler: props.removeEventHandler,
    })
  }

  return (
    <>
      <div className="flex space-x-1">
        <div className="grid grid-cols-1 content-center">
          <label
            htmlFor={props.fieldName}
            className="block text-sm text-color font-medium"
          >
            {props.fieldName}
            <span className={'ml-2 text-color-light font-normal'}>
              <>
                {props.typeNameLabel}
                <span className="pl-0.5">{props.isRequiredField && '!'}</span>
              </>
            </span>
          </label>
        </div>
        <div className="py-0.5">
          <DropDown
            menuEntries={dropDownEntries}
            openDirection={OpenDirection.bottomRight}
          />
        </div>
      </div>
      {props.children}
    </>
  )
}

export default FieldLabel
