'use client'

import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react'
import { Actions } from '../StyledButtonEnums'

export interface TransientNotification {
  type: Actions
  title: string
  body?: string
}

export interface InternalTransientNotificationData
  extends TransientNotification {
  id: number
}

interface TransientNotificationContextValue {
  addTransientNotification: (
    transientNotification: TransientNotification,
  ) => void
  transientNotifications: InternalTransientNotificationData[]
}

const transientNotificationContext =
  createContext<TransientNotificationContextValue>({
    addTransientNotification: () => {},
    transientNotifications: [],
  })

export const visibilityDuration = 5000
const deleteInvisibleAfter = 500

interface TransientNotificationProviderProps {}

export const TransientNotificationProvider: React.FC<
  PropsWithChildren<TransientNotificationProviderProps>
> = (props: PropsWithChildren<TransientNotificationProviderProps>) => {
  const [transientNotifications, setTransientNotifications] = useState<
    InternalTransientNotificationData[]
  >([])

  const lifecycleDuration = visibilityDuration + deleteInvisibleAfter

  const addTransientNotification = (
    transientNotification: TransientNotification,
  ): void => {
    const nextId = transientNotifications.length
    setTransientNotifications((prevState) => [
      ...prevState,
      { ...transientNotification, id: nextId },
    ])
    setTimeout(() => {
      removeTransientNotification(nextId)
    }, lifecycleDuration)
  }

  const removeTransientNotification = (id: number): void => {
    setTransientNotifications((prevState) =>
      prevState.filter((notification) => id !== notification.id),
    )
  }

  return (
    <transientNotificationContext.Provider
      value={
        {
          transientNotifications: transientNotifications,
          addTransientNotification: addTransientNotification,
        } as TransientNotificationContextValue
      }
    >
      {props.children}
    </transientNotificationContext.Provider>
  )
}

export const useTransientNotification = () =>
  useContext(transientNotificationContext)
