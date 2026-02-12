'use client'

import React, { createContext, PropsWithChildren, useContext } from 'react'
import { GraphQLSchema } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'

export interface EditorContextValue {
  schema: GraphQLSchema
  isNewEntry: boolean
  repositoryRefInfo: RepositoryRefInfo
}

const editorContext = createContext<EditorContextValue | null>(null)

interface EditorProviderProps {
  entryProps: EntryProps
  repositoryRefInfo: RepositoryRefInfo
}

interface EntryProps {
  schemaString: string
  isNewEntry: boolean
}

export interface RepositoryRefInfo {
  owner: string
  repository: string
  gitRef: string
}

export const EditorProvider: React.FC<
  PropsWithChildren<EditorProviderProps>
> = (props: PropsWithChildren<EditorProviderProps>) => {
  const schema = makeExecutableSchema({
    typeDefs: props.entryProps.schemaString,
  })

  return (
    <editorContext.Provider
      value={
        {
          schema: schema,
          isNewEntry: props.entryProps.isNewEntry,
          repositoryRefInfo: props.repositoryRefInfo,
        } as EditorContextValue
      }
    >
      {props.children}
    </editorContext.Provider>
  )
}

export const useEditor = () => useContext(editorContext)
