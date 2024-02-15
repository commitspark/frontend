'use client'

import React, {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useState,
} from 'react'
import { Activity } from '../shell/Application'
import type { Route } from 'next'

export interface ActivityProperties {
  key: Activity
  name: string
  link: Route
  iconName: string
}

export interface ActivityState {
  currentActivity: Activity | null
  availableActivities: ActivityProperties[]
}

const ActivityStateContext = createContext<ActivityState | null>(null)

interface ActivityStateContextProviderProps {
  children: ReactNode
  initialValue: ActivityState | null
}

export const ActivityProvider: React.FC<
  PropsWithChildren<ActivityStateContextProviderProps>
> = (props: PropsWithChildren<ActivityStateContextProviderProps>) => {
  const [activity, setActivity] = useState<ActivityState | null>(
    props.initialValue ?? null,
  )
  return (
    <ActivityStateContext.Provider value={activity}>
      {props.children}
    </ActivityStateContext.Provider>
  )
}

export const useActivity = () => useContext(ActivityStateContext)
