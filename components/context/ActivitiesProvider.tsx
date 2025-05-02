'use client'

import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react'

export interface ActivityRouteDefinition {
  id: string
  iconName: string
  initialRoute: string
}

export interface ActivitiesState {
  availableActivities: ActivityRouteDefinition[]
  idCurrentActivity: string
}

const ActivitiesStateContext = createContext<ActivitiesState | null>(null)

interface ActivityStateContextProviderProps {
  initialValue: ActivitiesState | null
}

export const ActivitiesProvider: React.FC<
  PropsWithChildren<ActivityStateContextProviderProps>
> = (props: PropsWithChildren<ActivityStateContextProviderProps>) => {
  const [activity, setActivity] = useState<ActivitiesState | null>(
    props.initialValue ?? null,
  )
  return (
    <ActivitiesStateContext.Provider value={activity}>
      {props.children}
    </ActivitiesStateContext.Provider>
  )
}

export const useActivities = () => useContext(ActivitiesStateContext)
