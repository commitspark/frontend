'use client'

import React, {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useContext,
  useRef,
} from 'react'
import { GraphQLSchema } from 'graphql/type'

export interface EditorContextValue {
  schema: MutableRefObject<GraphQLSchema>
  setSchema: (schema: GraphQLSchema) => void
  entryData: MutableRefObject<Record<string, any>>
  setEntryData: (entryData: Record<string, any>) => void
}

const editorContext = createContext<EditorContextValue | null>(null)

interface EditorProviderProps {
  entryProps: EntryProps
}

interface EntryProps {
  owner: string
  repository: string
  gitRef: string
  entryId?: string
  typeName?: string
}

export const EditorProvider: React.FC<
  PropsWithChildren<EditorProviderProps>
> = (props: PropsWithChildren<EditorProviderProps>) => {
  const currentEntryData = useRef<Record<string, any>>()
  const currentSchema = useRef<GraphQLSchema | undefined>(undefined)

  const setEntryData = (newEntryData: Record<string, any>): void => {
    currentEntryData.current = newEntryData
  }

  const setSchema = (schema: GraphQLSchema): void => {
    currentSchema.current = schema
  }

  return (
    <editorContext.Provider
      value={
        {
          schema: currentSchema,
          setSchema,
          entryData: currentEntryData,
          setEntryData,
        } as EditorContextValue
      }
    >
      {props.children}
    </editorContext.Provider>
  )
}

export const useEditor = () => useContext(editorContext)
