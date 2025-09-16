import React, { Fragment } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { classNames } from './lib/styling'
import DropDownEntry, { DropDownEntryProps } from './DropDownEntry'

interface DropDownProps {
  menuEntries: DropDownEntryProps[]
  customButton?: React.ReactElement
  customElement?: React.ReactElement
}

const DropDown: React.FC<DropDownProps> = (props: DropDownProps) => {
  if (props.menuEntries.length === 0) {
    return <></>
  }

  const baseClassName =
    props.customButton || props.customElement
      ? ''
      : 'flex items-center rounded-full menu-item-colors text-gray-600'

  const buttonElement = props.customButton || props.customElement || (
    <EllipsisVerticalIcon className="h-5 w-5" />
  )

  return (
    <Menu
      as="div"
      className="inline-block relative align-middle text-gray-700 text-sm"
    >
      <MenuButton
        as={props.customButton ? Fragment : 'button'}
        className={baseClassName}
      >
        {buttonElement}
      </MenuButton>

      <MenuItems
        className={classNames(
          'absolute mt-1 w-52 bg-white rounded shadow-md ring-1 ring-gray-200 focus:outline-0 z-20',
          'data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0',
        )}
        anchor={'bottom start'}
        transition
      >
        <div className="py-0.5">
          {props.menuEntries.map((entryProps: DropDownEntryProps, index) => (
            <MenuItem key={index}>
              {({ close }) => {
                const onClickHandler =
                  entryProps.onClickHandler !== undefined
                    ? (event: React.MouseEvent<HTMLButtonElement>) => {
                        close()
                        entryProps.onClickHandler !== undefined &&
                          entryProps.onClickHandler(event)
                      }
                    : undefined
                return (
                  <DropDownEntry
                    {...entryProps}
                    onClickHandler={onClickHandler}
                  />
                )
              }}
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  )
}

export default DropDown
