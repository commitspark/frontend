'use client'

import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react'
import { Actions } from '../StyledButtonEnums'

export interface TransientNotification {
  id: string
  type: Actions
  title: string
  body?: string
}

interface TransientNotificationContextValue {
  addTransientNotification: (
    transientNotification: TransientNotification,
  ) => void
  transientNotifications: TransientNotification[]
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
    TransientNotification[]
  >([])

  const lifecycleDuration = visibilityDuration + deleteInvisibleAfter

  const addTransientNotification = (
    transientNotification: TransientNotification,
  ): void => {
    setTransientNotifications((prevState) => [
      ...prevState,
      transientNotification,
    ])
    setTimeout(() => {
      removeTransientNotification(transientNotification.id)
    }, lifecycleDuration)
  }

  const removeTransientNotification = (id: string): void => {
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
