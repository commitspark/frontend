'use client'

import React, { useState } from 'react'
import StyledButton from '../StyledButton'
import { Actions, Size } from '../StyledButtonEnums'
import Modal from '../shell/Modal'
import { useTransientNotification } from '../context/TransientNotificationProvider'
import TextareaInput from '../styledInput/TextareaInput'

interface DeleteEntryModalProps {
  isOpen: boolean
  closeModalHandler: () => void
  entryId: string
  deleteHandler: (commitMessage: string) => Promise<void>
  deleteSuccessHandler: () => void
}

const DeleteEntryModal: React.FC<
  React.PropsWithChildren<DeleteEntryModalProps>
> = (props: React.PropsWithChildren<DeleteEntryModalProps>) => {
  const [commitMessage, setCommitMessage] = useState<string>('')
  const [isDeleting, setIsDeleting] = useState(false)
  const { addTransientNotification } = useTransientNotification()

  async function deleteButtonHandler() {
    setIsDeleting(true)
    let success = false
    try {
      await props.deleteHandler(commitMessage)
      success = true
    } catch (error) {
      // TODO add error details to notification
      addTransientNotification({
        id: Date.now().toString(),
        type: Actions.negative,
        title: 'Deletion failed',
        body: 'See browser console for details',
      })
      if (error instanceof Error) {
        console.error(error.message)
      } else {
        console.error(error)
      }
    } finally {
      props.closeModalHandler()
      setIsDeleting(false)
    }
    if (success) {
      props.deleteSuccessHandler()
    }
  }

  const primaryButton = (
    <StyledButton
      actionType={Actions.negative}
      size={Size.lg}
      disabled={isDeleting}
      onClick={deleteButtonHandler}
    >
      Delete
    </StyledButton>
  )

  return (
    <Modal
      isOpen={props.isOpen}
      isCancelButtonDisabled={isDeleting}
      onClose={() => !isDeleting && props.closeModalHandler()}
      title={'Delete entry'}
      primaryButton={primaryButton}
      iconName="ExclamationTriangleIcon"
      iconBackground={Actions.negative}
    >
      <div className="flex flex-col gap-y-4">
        <p className="text-sm text-color-light">
          Are you sure you want to delete this content entry?
        </p>
        <TextareaInput
          rows={3}
          placeholder={'Add a commit message...'}
          value={commitMessage}
          handleDataChangeEvent={setCommitMessage}
        />
      </div>
    </Modal>
  )
}

export default DeleteEntryModal
