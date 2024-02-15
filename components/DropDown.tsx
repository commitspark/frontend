import React, { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { classNames } from './lib/styling'
import DropDownEntry, { DropDownEntryProps } from './DropDownEntry'

export enum ButtonType {
  verticalEllipsis,
  custom,
}

export enum OpenDirection {
  bottomLeft,
  bottomRight,
}

interface DropDownProps {
  menuButtonType: ButtonType
  menuEntries: DropDownEntryProps[]
  openDirection?: OpenDirection
  button?: React.ReactElement
}

const DropDown: React.FC<DropDownProps> = (props: DropDownProps) => {
  let buttonClassName: string = ''
  let buttonElement: React.ReactElement = <></>

  switch (props.menuButtonType) {
    case ButtonType.verticalEllipsis: {
      buttonClassName =
        'flex items-center rounded-full menu-item-colors text-gray-600'
      buttonElement = <EllipsisVerticalIcon className="h-5 w-5" />
      break
    }
    case ButtonType.custom: {
      if (!props.button) {
        throw new Error('Expected button element')
      }
      buttonElement = props.button
      break
    }
  }

  if (props.menuEntries.length === 0) {
    return <></>
  }

  return (
    <Menu
      as="div"
      className="inline-block relative align-middle text-gray-700 text-sm"
    >
      <div>
        <Menu.Button className={buttonClassName}>{buttonElement}</Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={classNames(
            'absolute mt-1 w-52 bg-white rounded shadow-md ring-1 ring-gray-200 z-20',
            props.openDirection === undefined ||
              props.openDirection === OpenDirection.bottomLeft
              ? 'right-0 origin-top-right'
              : '',
            props.openDirection === OpenDirection.bottomRight
              ? 'left-0 origin-top-left'
              : '',
          )}
        >
          <div className="py-0.5">
            {props.menuEntries.map((entryProps: DropDownEntryProps, index) => (
              <Menu.Item key={index}>
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
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default DropDown
