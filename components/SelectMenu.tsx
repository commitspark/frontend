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
}

const SelectMenu: React.FC<SelectMenuProps> = (props: SelectMenuProps) => {
  const entries = props.entries
  const selectedEntry = entries.find(({ label }) => label === props.selectedId)

  if (!selectedEntry) {
    throw new Error('A selection must be provided')
  }

  const menuButton = (
    <StyledButton actionType={Actions.neutral}>
      <div className="flex flex-row">
        <span className="flex-grow truncate pr-6 inline-flex gap-x-1.5 items-baseline">
          {props.prefixIcon}
          {selectedEntry.label}
        </span>
        <ChevronDownIcon className="icon-size self-center" />
      </div>
    </StyledButton>
  )

  return <DropDown menuEntries={entries} customButton={menuButton} />
}

export default SelectMenu
