'use client'

import React, { useCallback, useEffect, useState } from 'react'
import ContentTypeForm from './form/ContentTypeForm'
import Loading from '../Loading'
import { EditorContextValue, useEditor } from '../context/EditorProvider'
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
import {
  fetchContent,
  fetchSchemaString,
  fetchTypeNameById,
  mutateEntry,
} from '../../app/server-actions/actions'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { GraphQLObjectType, isObjectType } from 'graphql/type'
import { createContentQueryFromNamedType } from '../lib/query-factory'
import { createDefaultData } from '../lib/default-data-generator'
import { deepEqual } from '../lib/content-utils'
import { assertIsString } from '../lib/assert'
import { commitEntry } from '../lib/commit'
import { useNavigationGuard } from 'next-navigation-guard'
import { getCookieSession } from '../lib/session'

interface EntryEditorProps {
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
    const session = getCookieSession()

    const entryId = entryData.id

    await commitEntry(
      session,
      props.owner,
      props.repository,
      props.gitRef,
      entryId,
      editorContext.schema.current,
      editorContext.isNewEntry ? 'create' : 'update',
      entryData,
      entryType.name,
      commitMessage,
    )

    setIsContentModified(false)
    setOriginalEntryData(entryData)

    return entryId
  }

  const doDelete = async (commitMessage: string): Promise<void> => {
    if (!props.owner || !props.repository || !props.gitRef || !props.entryId) {
      throw new Error(
        'Repository info and entry ID required for deleting entry',
      )
    }
    const session = getCookieSession()

    // TODO simplify this to use the type information we loaded when the editor was instantiated
    const typeName = await fetchTypeNameById(
      session,
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
    await mutateEntry(
      session,
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
      router.push(
        routes.editEntry(props.owner, props.repository, props.gitRef, entryId),
      )
    }
    addTransientNotification({
      id: Date.now().toString(),
      type: Actions.positive,
      title: 'Commit succeeded',
    })
  }

  function deleteSuccessHandler(): void {
    if (!entryType) {
      // should never reach this
      router.push(
        routes.entryTypesList(props.owner, props.repository, props.gitRef),
      )
    } else {
      router.push(
        routes.entriesOfTypeList(
          props.owner,
          props.repository,
          props.gitRef,
          entryType.name,
        ),
      )
    }
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

  useNavigationGuard({
    enabled: isContentModified,
    confirm: () =>
      window.confirm(
        'You have unsaved changes. Are you sure you want to leave?',
      ),
  })

  useEffect(() => {
    const fetchEntry = async (): Promise<void> => {
      if (!!props.entryId === !!props.typeName) {
        throw new Error('Expected one of entryId or typeName')
      }
      const session = getCookieSession()

      const schemaString = await fetchSchemaString(
        session,
        props.owner,
        props.repository,
        props.gitRef,
      )

      let typeName
      if (props.entryId !== undefined) {
        typeName = await fetchTypeNameById(
          session,
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
        const contentResponse = await fetchContent(
          session,
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
        // TODO update entry data with mandatory default data as required by schema where it is needed
        entryData = contentResponse.data
      } else {
        entryData = createDefaultData(type, 0)
      }

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

    fetchEntry()

    return () => {
      setIsSchemaLoaded(false)
      setIsContentLoaded(false)
      setOriginalEntryData(undefined)
      setIsContentModified(false)
      setEntryType(undefined)
    }
  }, [
    props.owner,
    props.repository,
    props.gitRef,
    props.entryId,
    props.typeName,
    editorContext,
  ])

  if (!entryType) {
    return <></>
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
      {!(isSchemaLoaded && isContentLoaded) && <Loading />}
      {isSchemaLoaded && isContentLoaded && (
        <Column
          pageHeading={
            <div className={'flex-none pr-4 border-b app-border-color'}>
              <PageHeading
                title={props.entryId ?? 'New entry'}
                subTitle={entryType.name}
                backLink={routes.entriesOfTypeList(
                  props.owner,
                  props.repository,
                  props.gitRef,
                  entryType.name,
                )}
              >
                <div className="flex flex-row gap-x-4 items-center">
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
