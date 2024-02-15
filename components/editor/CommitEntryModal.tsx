'use client'

import React, { useState } from 'react'
import StyledButton from '../StyledButton'
import { Actions, Size } from '../StyledButtonEnums'
import Modal from '../shell/Modal'
import { useTransientNotification } from '../context/TransientNotificationProvider'
import TextareaInput from '../styledInput/TextareaInput'

interface CommitEntryModalProps {
  isOpen: boolean
  closeModalHandler: () => void
  commitHandler: (commitMessage: string) => Promise<string>
  commitSuccessHandler: (entryId: string) => void
}

const CommitEntryModal: React.FC<CommitEntryModalProps> = (
  props: CommitEntryModalProps,
) => {
  const [commitMessage, setCommitMessage] = useState<string>('')
  const [isCommitting, setIsCommitting] = useState(false)
  const { addTransientNotification } = useTransientNotification()

  async function commitButtonHandler() {
    setIsCommitting(true)

    let entryId: string | null = null
    try {
      entryId = await props.commitHandler(commitMessage)
    } catch (error) {
      // TODO add error details to notification
      addTransientNotification({
        id: Date.now().toString(),
        type: Actions.negative,
        title: 'Commit failed',
        body: 'See browser console for details',
      })
      if (error instanceof Error) {
        console.error(error.message)
      } else {
        console.error(error)
      }
    } finally {
      props.closeModalHandler()
      setIsCommitting(false)
    }

    if (entryId) {
      props.commitSuccessHandler(entryId)
    }
  }

  const primaryButton = (
    <StyledButton
      actionType={Actions.primary}
      size={Size.lg}
      disabled={isCommitting}
      onClick={commitButtonHandler}
    >
      Commit
    </StyledButton>
  )

  return (
    <Modal
      isOpen={props.isOpen}
      isCancelButtonDisabled={isCommitting}
      onClose={() => !isCommitting && props.closeModalHandler()}
      title={'Commit changes'}
      primaryButton={primaryButton}
      iconName="InformationCircleIcon"
      iconBackground={Actions.positive}
    >
      <TextareaInput
        rows={3}
        placeholder={'Add a commit message...'}
        value={commitMessage}
        handleDataChangeEvent={setCommitMessage}
        disabled={isCommitting}
      />
    </Modal>
  )
}

export default CommitEntryModal
