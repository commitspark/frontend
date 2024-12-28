'use client'

import React, { useCallback, useState } from 'react'
import ContentTypeForm from './form/ContentTypeForm'
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
import { actionMutateEntry } from '../../app/server-actions/actions'
import { isObjectType } from 'graphql/type'
import { deepEqual } from '../lib/content-utils'
import { commitEntry } from '../lib/commit'
import { useNavigationGuard } from 'next-navigation-guard'
import { getCookieSession } from '../lib/session'

interface EntryEditorProps {
  initialData: Record<string, any>
  entryId?: string
  typeName: string
}

const EntryEditor: React.FC<EntryEditorProps> = (props) => {
  const editorContext = useEditor() as EditorContextValue
  const [isCommitEntryModalOpen, setIsCommitEntryModalOpen] =
    useState<boolean>(false)
  const [isDeleteEntryModalOpen, setIsDeleteEntryModalOpen] =
    useState<boolean>(false)
  const router = useRouter()
  const { addTransientNotification } = useTransientNotification()

  const [entryData, setEntryData] = useState<Record<string, any> | null>(
    props.initialData,
  )
  const [originalEntryData, setOriginalEntryData] = useState<
    Record<string, any> | undefined
  >(props.initialData)
  const [isContentModified, setIsContentModified] = useState<boolean>(false)

  const entryType = editorContext.schema.getType(props.typeName)
  if (!isObjectType(entryType)) {
    throw new Error(`Expected GraphQLObjectType for type "${props.typeName}".`)
  }

  const doCommit = async (commitMessage: string): Promise<string> => {
    if (!entryData) {
      throw new Error('Cannot commit without required data')
    }
    const session = await getCookieSession()

    const entryId = entryData.id

    await commitEntry(
      session,
      editorContext.repositoryRefInfo.owner,
      editorContext.repositoryRefInfo.repository,
      editorContext.repositoryRefInfo.gitRef,
      entryId,
      editorContext.schema,
      editorContext.isNewEntry ? 'create' : 'update',
      entryData,
      props.typeName,
      commitMessage,
    )

    setIsContentModified(false)
    setOriginalEntryData(entryData)

    return entryId
  }

  const doDelete = async (commitMessage: string): Promise<void> => {
    if (!props.entryId) {
      throw new Error('Entry ID required to delete an entry')
    }
    const session = await getCookieSession()

    const mutation = {
      query:
        `mutation ($id: ID!, $message: String!){\n` +
        `data: delete${props.typeName}(id: $id, message: $message) { id }\n` +
        '}',
      variables: {
        id: props.entryId,
        message: commitMessage,
      },
    }
    await actionMutateEntry(
      session,
      editorContext.repositoryRefInfo.owner,
      editorContext.repositoryRefInfo.repository,
      editorContext.repositoryRefInfo.gitRef,
      mutation,
    )

    setIsContentModified(false)
  }

  const updateIsContentModified = (
    originalEntryData: Record<string, any> | undefined,
    newData: Record<string, any>,
  ): void => {
    setIsContentModified(!deepEqual(originalEntryData, newData))
  }

  const childDataChangeRequestHandler = useCallback(
    (_childName: string, childData: Record<string, any>): void => {
      setEntryData(childData)
      updateIsContentModified(originalEntryData, childData)
    },
    [originalEntryData],
  )

  const commitSuccessHandler = (entryId: string): void => {
    if (editorContext.isNewEntry) {
      // TODO invalidate Next.js entry list page cache
      // use timeout to wait for `isContentModified` state to be updated so that navigation guard does not kick in
      setTimeout(() => {
        router.push(
          routes.editEntry(
            editorContext.repositoryRefInfo.owner,
            editorContext.repositoryRefInfo.repository,
            editorContext.repositoryRefInfo.gitRef,
            entryId,
          ),
        )
      }, 0)
    }

    addTransientNotification({
      id: Date.now().toString(),
      type: Actions.positive,
      title: 'Commit succeeded',
    })
  }

  function deleteSuccessHandler(): void {
    // TODO invalidate Next.js entry list page cache
    // use timeout to wait for `isContentModified` state to be updated so that navigation guard does not kick in
    setTimeout(() => {
      router.push(
        routes.entriesOfTypeList(
          editorContext.repositoryRefInfo.owner,
          editorContext.repositoryRefInfo.repository,
          editorContext.repositoryRefInfo.gitRef,
          props.typeName,
        ),
      )
    }, 0)

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
      <Column
        pageHeading={
          <div className={'flex-none pr-4 border-b app-border-color'}>
            <PageHeading
              title={props.entryId ?? 'New entry'}
              subTitle={props.typeName}
              backLink={routes.entriesOfTypeList(
                editorContext.repositoryRefInfo.owner,
                editorContext.repositoryRefInfo.repository,
                editorContext.repositoryRefInfo.gitRef,
                props.typeName,
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
            fieldName={props.typeName}
            data={entryData}
            onChildDataChangeRequestHandler={childDataChangeRequestHandler}
          />
        </form>
      </Column>
    </>
  )
}

export default EntryEditor
