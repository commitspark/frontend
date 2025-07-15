'use client'

import React, { useCallback, useState } from 'react'
import ContentTypeForm from './form/ContentTypeForm'
import { EditorContextValue, useEditor } from '../context/EditorProvider'
import Column from '../shell/Column'
import EditorHeading from './EditorHeading'
import { Actions, Size } from '../StyledButtonEnums'
import CommitEntryModal from './CommitEntryModal'
import DropDown from '../DropDown'
import { DropDownEntryProps } from '../DropDownEntry'
import StyledButton from '../StyledButton'
import DeleteEntryModal from './DeleteEntryModal'
import { useRouter } from 'next/navigation'
import { useTransientNotification } from '../context/TransientNotificationProvider'
import {
  actionMutateEntry,
  actionRevalidatePath,
} from '@/app/server-actions/actions'
import { isObjectType } from 'graphql/type'
import { deepEqual } from '../lib/content-utils'
import { commitEntry } from '../lib/commit'
import { useNavigationGuard } from 'next-navigation-guard'
import { getCookieSession } from '../lib/session'
import { commitsparkConfig } from '@commitspark-config'
import {
  EditingActivityId,
  RouteIdEditEntry,
  RouteIdEntriesOfTypeList,
} from '@/components/editing/types'
import { EntryData } from '@commitspark/git-adapter'
import { assertIsString, assertIsStringOrNull } from '@/components/lib/assert'

interface EntryEditorProps {
  initialData: EntryData
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

  const [entryData, setEntryData] = useState<EntryData>(props.initialData)
  const [originalEntryData, setOriginalEntryData] = useState<EntryData>(
    props.initialData,
  )
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
    assertIsStringOrNull(entryId)

    const committedEntryData = await commitEntry(
      session,
      editorContext.repositoryRefInfo.owner,
      editorContext.repositoryRefInfo.repository,
      editorContext.repositoryRefInfo.gitRef,
      entryId,
      editorContext.isNewEntry ? 'create' : 'update',
      entryData,
      props.typeName,
      commitMessage,
    )

    setIsContentModified(false)
    setEntryData(committedEntryData)
    setOriginalEntryData(committedEntryData)

    const committedEntryId = committedEntryData?.id
    assertIsString(committedEntryId)

    return committedEntryId
  }

  const doDelete = async (commitMessage: string): Promise<void> => {
    if (!props.entryId) {
      throw new Error('Entry ID required to delete an entry')
    }
    const session = await getCookieSession()

    const mutation = {
      query:
        `mutation ($id: ID!, $commitMessage: String!) {\n` +
        `data: delete${props.typeName}(id: $id, commitMessage: $commitMessage)\n` +
        '}',
      variables: {
        id: props.entryId,
        commitMessage: commitMessage,
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
    originalEntryData: EntryData,
    newData: EntryData,
  ): void => {
    setIsContentModified(!deepEqual(originalEntryData, newData))
  }

  const childDataChangeRequestHandler = useCallback(
    (_childName: string, childData: EntryData): void => {
      setEntryData(childData)
      updateIsContentModified(originalEntryData, childData)
    },
    [originalEntryData],
  )

  const editingActivity = commitsparkConfig.activities.find(
    (activity) => activity.id === EditingActivityId,
  )
  if (!editingActivity) {
    throw new Error('Cannot find editing activity')
  }

  const entryListPagePath = editingActivity.routeGenerator(
    RouteIdEntriesOfTypeList,
    [
      editorContext.repositoryRefInfo.owner,
      editorContext.repositoryRefInfo.repository,
      editorContext.repositoryRefInfo.gitRef,
      props.typeName,
    ],
  )

  const commitSuccessHandler = async (entryId: string): Promise<void> => {
    const entryPagePath = editingActivity.routeGenerator(RouteIdEditEntry, [
      editorContext.repositoryRefInfo.owner,
      editorContext.repositoryRefInfo.repository,
      editorContext.repositoryRefInfo.gitRef,
      entryId,
    ])

    if (editorContext.isNewEntry) {
      // TODO or if entry ID has changed (e.g. due to preCommit hook)
      await actionRevalidatePath(entryListPagePath)

      // use timeout to wait for `isContentModified` state to be updated so that navigation guard does not kick in
      setTimeout(() => {
        router.push(entryPagePath)
      }, 0)
    } else {
      await actionRevalidatePath(entryPagePath)
    }

    addTransientNotification({
      id: Date.now().toString(),
      type: Actions.positive,
      title: 'Commit succeeded',
    })
  }

  const deleteSuccessHandler = async (): Promise<void> => {
    await actionRevalidatePath(entryListPagePath)

    // use timeout to wait for `isContentModified` state to be updated so that navigation guard does not kick in
    setTimeout(() => {
      router.push(
        editingActivity.routeGenerator(RouteIdEntriesOfTypeList, [
          editorContext.repositoryRefInfo.owner,
          editorContext.repositoryRefInfo.repository,
          editorContext.repositoryRefInfo.gitRef,
          props.typeName,
        ]),
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

  const backLink = editingActivity.routeGenerator(RouteIdEntriesOfTypeList, [
    editorContext.repositoryRefInfo.owner,
    editorContext.repositoryRefInfo.repository,
    editorContext.repositoryRefInfo.gitRef,
    props.typeName,
  ])

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
          <EditorHeading
            entryId={props.entryId ?? 'New entry'}
            entryTypeName={props.typeName}
            branchName={editorContext.repositoryRefInfo.gitRef}
          >
            <div className="flex flex-row gap-x-4 items-center">
              <StyledButton
                actionType={Actions.neutral}
                size={Size.lg}
                onClick={(event) => {
                  event.preventDefault()
                  router.push(backLink)
                }}
                aria-label="Cancel"
              >
                Cancel
              </StyledButton>
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
          </EditorHeading>
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
