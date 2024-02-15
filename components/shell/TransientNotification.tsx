'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import {
  TransientNotification,
  visibilityDuration,
} from '../context/TransientNotificationProvider'
import { Actions } from '../StyledButtonEnums'
import { classNames } from '../lib/styling'
import DynamicIcon, { IconTheme } from '../DynamicIcon'

export interface TransientNotificationProps {
  notification: TransientNotification
}

const TransientNotification: React.FC<
  React.PropsWithChildren<TransientNotificationProps>
> = (props: React.PropsWithChildren<TransientNotificationProps>) => {
  const [isVisible, setIsVisible] = useState<boolean>(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, visibilityDuration)
    return () => clearTimeout(timer)
  }, [])

  let iconColor: string
  let iconName: string
  switch (props.notification.type) {
    case Actions.positive:
      iconColor = 'text-green-400'
      iconName = 'CheckCircleIcon'
      break
    case Actions.negative:
      iconColor = 'text-red-400'
      iconName = 'ExclamationCircleIcon'
      break
    default:
      iconColor = 'text-gray-400'
      iconName = 'InformationCircleIcon'
      break
  }

  return (
    <>
      <Transition
        show={isVisible}
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="pointer-events-auto rounded-md shadow-lg border app-border-color bg-white">
          <div className="p-4">
            <div className="flex flex-row gap-x-3">
              <div className="flex-none">
                <DynamicIcon
                  iconTheme={IconTheme.OutlineIcons24}
                  iconName={iconName}
                  className={classNames('icon-size-lg', iconColor)}
                />
              </div>
              <div className="overflow-hidden">
                <p className="text-ellipsis overflow-hidden text-sm font-medium text-color">
                  {props.notification.title}
                </p>
                <p className="text-ellipsis overflow-hidden mt-1 text-sm text-color-light">
                  {props.notification.body}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </>
  )
}

export default TransientNotification
