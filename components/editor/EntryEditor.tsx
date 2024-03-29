'use client'

import React, { useCallback, useEffect, useState } from 'react'
import ContentTypeForm from './form/ContentTypeForm'
import Loading from '../Loading'
import {
  AiInstructionHandler,
  AiProgressHandler,
  EditorContextValue,
  useEditor,
} from '../context/EditorProvider'
import Column from '../shell/Column'
import PageHeading from '../PageHeading'
import { routes } from '../lib/route-generator'
import { Actions, Size } from '../StyledButtonEnums'
import CommitEntryModal from './CommitEntryModal'
import DropDown from '../DropDown'
import { DropDownEntryProps } from '../DropDownEntry'
import StyledButton from '../StyledButton'
import DeleteEntryModal from './DeleteEntryModal'
import { useRouter } from 'next/navigation'
import { useTransientNotification } from '../context/TransientNotificationProvider'
import AiModal from './AiModal'
import { processAiInstruction } from '../lib/ai'
import { getCookie } from 'cookies-next'
import { COOKIE_PROVIDER_TOKEN_GITHUB } from '../../lib/cookies'
import { fetchContent, fetchSchema, fetchTypeNameById } from '../lib/fetch'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { GraphQLObjectType, isObjectType } from 'graphql/type'
import { createContentQueryFromNamedType } from '../lib/query'
import { createDefaultData } from '../lib/default-data-generator'
import { deepEqual } from '../lib/content-utils'
import { assertIsString } from '../lib/assert'
import { v4 as uuidv4 } from 'uuid'
import { commitContentEntry } from '../lib/commit'
import { mutateContent } from '../lib/mutate'
import { STORAGE_TOKEN_OPEN_AI } from '../../lib/localStorage'

interface EntryEditorProps {
  provider: string
  owner: string
  repository: string
  gitRef: string
  entryId?: string
  typeName?: string
}

export default function EntryEditor(props: EntryEditorProps) {
  const editorContext = useEditor() as EditorContextValue
  const [isCommitEntryModalOpen, setIsCommitEntryModalOpen] =
    useState<boolean>(false)
  const [isDeleteEntryModalOpen, setIsDeleteEntryModalOpen] =
    useState<boolean>(false)
  const router = useRouter()
  const { addTransientNotification } = useTransientNotification()
  const openAiToken: string =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem(STORAGE_TOKEN_OPEN_AI) ?? ''
      : ''
  const gitToken: string = `${getCookie(COOKIE_PROVIDER_TOKEN_GITHUB)}`

  const [entryData, setEntryData] = useState<Record<string, any> | null>(null)
  const [originalEntryData, setOriginalEntryData] = useState<
    Record<string, any> | undefined
  >(undefined)
  const [entryType, setEntryType] = useState<GraphQLObjectType | undefined>(
    undefined,
  )
  const [isSchemaLoaded, setIsSchemaLoaded] = useState<boolean>(false)
  const [isContentLoaded, setIsContentLoaded] = useState<boolean>(false)
  const [isContentModified, setIsContentModified] = useState<boolean>(false)

  const doCommit = async (commitMessage: string): Promise<string> => {
    if (!editorContext.schema.current || !entryData || !entryType) {
      throw new Error('Cannot commit without required data')
    }

    const entryId = props.entryId ?? uuidv4() // TODO remove this once editing form UI supports entering own ID

    await commitContentEntry(
      props.provider,
      gitToken,
      props.owner,
      props.repository,
      props.gitRef,
      entryId,
      editorContext.schema.current,
      props.entryId ? 'update' : 'create',
      entryData,
      entryType.name,
      commitMessage,
    )

    setIsContentModified(false)
    setOriginalEntryData(entryData)

    return entryId
  }

  const doDelete = async (commitMessage: string): Promise<void> => {
    if (
      !props.provider ||
      !props.owner ||
      !props.repository ||
      !props.gitRef ||
      !props.entryId
    ) {
      throw new Error(
        'Repository info and entry ID required for deleting entry',
      )
    }

    // TODO simplify this to use the type information we loaded when the editor was instantiated
    const typeName = await fetchTypeNameById(
      props.provider,
      gitToken,
      props.owner,
      props.repository,
      props.gitRef,
      props.entryId,
    )
    const mutation = {
      query:
        `mutation ($id: ID!, $message: String!){\n` +
        `data: delete${typeName}(id: $id, message: $message) { id }\n` +
        '}',
      variables: {
        id: props.entryId,
        message: commitMessage,
      },
    }
    await mutateContent(
      props.provider,
      gitToken,
      props.owner,
      props.repository,
      props.gitRef,
      mutation,
    )
  }

  const updateIsContentModified = async (
    originalEntryData: Record<string, any> | undefined,
    newData: Record<string, any>,
  ): Promise<void> => {
    setIsContentModified(!deepEqual(originalEntryData, newData))
  }

  const childDataChangeRequestHandler = useCallback(
    (_childName: string, childData: Record<string, any>): void => {
      setEntryData(childData)
      editorContext.setEntryData(childData)
      updateIsContentModified(originalEntryData, childData)
    },
    [originalEntryData],
  )

  function commitSuccessHandler(entryId: string): void {
    // if new entry first committed
    if (props.entryId !== entryId) {
      const encodedRef = encodeURIComponent(props.gitRef)
      router.push(
        `/p/${props.provider}/repo/${props.owner}/${props.repository}/ref/${encodedRef}/id/${entryId}/`,
      )
    }
    addTransientNotification({
      id: Date.now().toString(),
      type: Actions.positive,
      title: 'Commit succeeded',
    })
  }

  function deleteSuccessHandler(): void {
    const encodedRef = encodeURIComponent(props.gitRef)
    router.push(
      `/p/${props.provider}/repo/${props.owner}/${props.repository}/ref/${encodedRef}/type/${entryType}/`,
    )
    addTransientNotification({
      id: Date.now().toString(),
      type: Actions.positive,
      title: 'Entry deleted',
    })
  }

  const dropDownMenuEntries: DropDownEntryProps[] = []
  // only entries with ID can have been committed and therefore can be deleted
  if (props.entryId) {
    dropDownMenuEntries.push({
      iconName: 'TrashIcon',
      label: 'Delete entry',
      onClickHandler: () => setIsDeleteEntryModalOpen(true),
    })
  }

  useEffect(() => {
    async function fetchEntry(): Promise<void> {
      if (!!props.entryId === !!props.typeName) {
        throw new Error('Expected one of entryId or typeName')
      }

      const schemaString = await fetchSchema(
        props.provider,
        gitToken,
        props.owner,
        props.repository,
        props.gitRef,
      )

      let typeName
      if (props.entryId !== undefined) {
        typeName = await fetchTypeNameById(
          props.provider,
          gitToken,
          props.owner,
          props.repository,
          props.gitRef,
          props.entryId,
        )
      } else {
        typeName = props.typeName
      }
      assertIsString(typeName)

      const schema = makeExecutableSchema({
        typeDefs: schemaString,
      })
      const type = schema.getType(typeName)
      if (!isObjectType(type)) {
        throw new Error(`Expected GraphQLObjectType for type "${typeName}".`)
      }

      let entryData
      if (props.entryId !== undefined) {
        const entryContentQuery = createContentQueryFromNamedType(type)
        const entryResponse = await fetchContent(
          props.provider,
          gitToken,
          props.owner,
          props.repository,
          props.gitRef,
          {
            query: `query ($id: ID!) {data: ${typeName}(id:$id) ${entryContentQuery}}`,
            variables: {
              id: props.entryId,
            },
          },
        )
        if (
          entryResponse.errors &&
          Array.isArray(entryResponse.errors) &&
          entryResponse.errors.length > 0
        ) {
          const message = entryResponse.errors
            .map((error) => error.message)
            .join('\n')
          throw new Error(message)
        }
        // TODO update entry data with mandatory default data as required by schema where it is needed
        entryData = entryResponse.data.data
      } else {
        entryData = createDefaultData(type, 0)
      }

      if (!ignore) {
        setEntryData(entryData)
        editorContext.setEntryData(entryData)
        if (props.entryId === undefined) {
          setOriginalEntryData(undefined)
          setIsContentModified(true)
        } else {
          setOriginalEntryData(entryData)
          setIsContentModified(false)
        }
        setEntryType(type)
        editorContext.setSchema(schema)
        setIsSchemaLoaded(true)
        setIsContentLoaded(true)
      }
    }

    let ignore = false
    fetchEntry()
    return () => {
      ignore = true
    }
  }, [])

  let aiAbortController: AbortController | null = null
  useEffect(() => {
    return () => {
      if (aiAbortController) {
        aiAbortController.abort()
      }
    }
  }, [aiAbortController])

  if (!entryType) {
    return <></>
  }

  const aiInstructionHandler: AiInstructionHandler = async (
    instruction: string,
    aiProgressHandler: AiProgressHandler,
  ): Promise<void> => {
    if (!aiAbortController) {
      throw new Error('Expected AbortController instance')
    }

    const responseData = await processAiInstruction(
      openAiToken,
      editorContext.schema.current,
      entryType,
      null,
      editorContext.entryData.current,
      editorContext.entryData.current,
      instruction,
      aiProgressHandler,
      aiAbortController.signal,
    )

    if (aiAbortController.signal.aborted) {
      return
    }

    // TODO assert entry ID has not been changed
    setEntryData(responseData.data)
    editorContext.setEntryData(responseData.data)
    editorContext.closeAiModal()
  }

  const aiButtonHandler = (
    event: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    event.preventDefault()
    aiAbortController = new AbortController()
    editorContext.openAiModal(aiInstructionHandler, aiAbortController)
  }

  return (
    <>
      <CommitEntryModal
        isOpen={isCommitEntryModalOpen}
        closeModalHandler={() => setIsCommitEntryModalOpen(false)}
        commitHandler={doCommit}
        commitSuccessHandler={commitSuccessHandler}
      />
      {props.entryId && (
        <DeleteEntryModal
          isOpen={isDeleteEntryModalOpen}
          closeModalHandler={() => setIsDeleteEntryModalOpen(false)}
          entryId={props.entryId}
          deleteHandler={doDelete}
          deleteSuccessHandler={deleteSuccessHandler}
        />
      )}
      {editorContext.isAiEnabled && <AiModal />}
      {!(isSchemaLoaded && isContentLoaded) && <Loading />}
      {isSchemaLoaded && isContentLoaded && (
        <Column
          pageHeading={
            <div className={'flex-none pr-4 border-b app-border-color'}>
              <PageHeading
                title={props.entryId ?? 'New entry'}
                subTitle={entryType.name}
                backLink={routes.contentEntriesOfTypeList(
                  props.provider,
                  props.owner,
                  props.repository,
                  props.gitRef,
                  entryType.name,
                )}
              >
                <div className="flex flex-row gap-x-4 items-center">
                  {editorContext.isAiEnabled && (
                    <StyledButton
                      actionType={Actions.neutral}
                      disabled={false}
                      size={Size.lg}
                      onClick={aiButtonHandler}
                      aria-label="AI Assist"
                    >
                      AI
                    </StyledButton>
                  )}

                  <StyledButton
                    actionType={Actions.primary}
                    disabled={!isContentModified}
                    size={Size.lg}
                    onClick={(event) => {
                      event.preventDefault()
                      setIsCommitEntryModalOpen(true)
                    }}
                    aria-label="Commit entry"
                  >
                    Commit
                  </StyledButton>

                  <DropDown menuEntries={dropDownMenuEntries} />
                </div>
              </PageHeading>
            </div>
          }
        >
          <form>
            <ContentTypeForm
              objectType={entryType}
              fieldName={entryType.name}
              data={entryData}
              onChildDataChangeRequestHandler={childDataChangeRequestHandler}
            />
          </form>
        </Column>
      )}
    </>
  )
}
