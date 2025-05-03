'use client'

import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react'

// see https://github.com/vercel/next.js/tree/canary/examples/with-context-api for help

export interface RepositoryInfoState {
  owner: string | null
  repository: string | null
}

const RepositoryInfoStateContext = createContext<RepositoryInfoState | null>(
  null,
)

type RepositoryContextProviderProps = {
  initialValue?: RepositoryInfoState | null
}

export const RepositoryInfoProvider: React.FC<
  PropsWithChildren<RepositoryContextProviderProps>
> = ({
  children,
  initialValue = null,
}: PropsWithChildren<RepositoryContextProviderProps>) => {
  const [repositoryInfoState, setRepositoryInfoState] =
    useState<RepositoryInfoState | null>(initialValue)
  return (
    <RepositoryInfoStateContext.Provider value={repositoryInfoState}>
      {children}
    </RepositoryInfoStateContext.Provider>
  )
}

export const useRepositoryInfo = () => useContext(RepositoryInfoStateContext)
