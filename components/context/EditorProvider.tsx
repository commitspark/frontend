'use client'

import React, {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'
import { GraphQLSchema } from 'graphql/type'
import { STORAGE_TOKEN_OPEN_AI } from '../../lib/localStorage'

export interface AiInstructionHandler {
  (instruction: string, aiProgressHandler: AiProgressHandler): Promise<void>
}

export interface AiProgressHandler {
  (characterCount: number): void
}

export interface EditorContextValue {
  isAiEnabled: boolean
  isAiModalOpen: boolean
  openAiModal: (
    instructionHandler: AiInstructionHandler,
    aiAbortController: AbortController,
  ) => void
  closeAiModal: () => void
  executeAiInstructionHandler: AiInstructionHandler
  abortAiInstructionController: AbortController
  schema: MutableRefObject<GraphQLSchema>
  setSchema: (schema: GraphQLSchema) => void
  entryData: MutableRefObject<Record<string, any>>
  setEntryData: (entryData: Record<string, any>) => void
}

interface AiModalData {
  aiInstructionHandler: AiInstructionHandler
  abortAiInstructionController: AbortController | null
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
  const openAiToken: string | null =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem(STORAGE_TOKEN_OPEN_AI) ?? null
      : null

  const currentEntryData = useRef<Record<string, any>>()
  const currentSchema = useRef<GraphQLSchema | undefined>(undefined)

  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false)
  const noOpHandler = useCallback((): Promise<void> => {
    return new Promise((resolve) => {})
  }, [])
  const [aiModalData, setAiModalData] = useState<AiModalData>({
    aiInstructionHandler: noOpHandler,
    abortAiInstructionController: null,
  })

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
          isAiEnabled: !!openAiToken,
          isAiModalOpen,
          openAiModal: (
            aiInstructionHandler: AiInstructionHandler,
            abortAiInstructionController: AbortController,
          ) => {
            setAiModalData({
              aiInstructionHandler,
              abortAiInstructionController,
            })
            setIsAiModalOpen(true)
          },
          closeAiModal: () => {
            setAiModalData({
              aiInstructionHandler: noOpHandler,
              abortAiInstructionController: null,
            })
            setIsAiModalOpen(false)
          },
          executeAiInstructionHandler: aiModalData.aiInstructionHandler,
          abortAiInstructionController:
            aiModalData.abortAiInstructionController,
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
