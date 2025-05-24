import React, { ReactElement } from 'react'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import DropDown from '@/components/DropDown'
import StyledButton from '@/components/StyledButton'
import { Actions } from '@/components/StyledButtonEnums'
import { DropDownEntryProps } from '@/components/DropDownEntry'

interface SelectMenuProps {
  entries: DropDownEntryProps[]
  selectedId: string
  prefixIcon?: ReactElement
  disabled?: boolean
}

const SelectMenu: React.FC<SelectMenuProps> = (props: SelectMenuProps) => {
  const entries = props.entries
  const selectedEntry = entries.find(({ label }) => label === props.selectedId)

  if (!selectedEntry) {
    throw new Error('A selection must be provided')
  }

  const menuButton = (
    <StyledButton actionType={Actions.neutral} disabled={props.disabled}>
      <div className="flex flex-row min-w-52">
        {props.prefixIcon && (
          <div className="pr-1.5 inline-flex items-baseline">
            {props.prefixIcon}
          </div>
        )}
        <div className="flex-grow truncate text-left">
          {selectedEntry.label}
        </div>
        <ChevronDownIcon className="icon-size self-center" />
      </div>
    </StyledButton>
  )

  return <DropDown menuEntries={entries} customButton={menuButton} />
}

export default SelectMenu
