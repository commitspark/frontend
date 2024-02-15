'use client'

import React from 'react'
import { useTransientNotification } from '../context/TransientNotificationProvider'
import TransientNotification, {
  TransientNotificationProps,
} from './TransientNotification'

interface TransientNotificationsAreaProps {}

const TransientNotificationsArea: React.FC<
  React.PropsWithChildren<TransientNotificationsAreaProps>
> = (props: React.PropsWithChildren<TransientNotificationsAreaProps>) => {
  const { transientNotifications } = useTransientNotification()

  const notificationComponents: React.ReactElement<TransientNotificationProps>[] =
    transientNotifications.map((transientNotification) => {
      return (
        <TransientNotification
          key={transientNotification.id}
          notification={transientNotification}
        />
      )
    })

  return (
    <>
      <div className="p-6 fixed inset-0 z-10 pointer-events-none">
        <div className="flex flex-col items-end">
          <div className="flex flex-col gap-y-4 w-full max-w-sm">
            {notificationComponents}
          </div>
        </div>
      </div>
    </>
  )
}

export default TransientNotificationsArea
