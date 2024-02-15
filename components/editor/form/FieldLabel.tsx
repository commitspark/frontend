import React from 'react'
import DropDown, { ButtonType, OpenDirection } from '../../DropDown'
import { DropDownEntryProps } from '../../DropDownEntry'
import { IconTheme } from '../../DynamicIcon'

interface FieldLabelProps {
  fieldName: string
  typeNameLabel: string
  isRequiredField: boolean
  offerRemoveAction: boolean
  removeEventHandler: () => void
  aiEventHandler: null | (() => void)
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
  if (props.aiEventHandler !== null) {
    dropDownEntries.push({
      label: 'AI Assist',
      iconTheme: IconTheme.OutlineIcons24,
      iconName: 'LightBulbIcon',
      onClickHandler: props.aiEventHandler,
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
            menuButtonType={ButtonType.verticalEllipsis}
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
