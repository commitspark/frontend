'use client'

import React, { useState } from 'react'
import StyledButton from '../StyledButton'
import { Actions, Size } from '../StyledButtonEnums'
import Modal from '../shell/Modal'
import { EditorContextValue, useEditor } from '../context/EditorProvider'
import { useTransientNotification } from '../context/TransientNotificationProvider'
import TextareaInput from '../styledInput/TextareaInput'

interface AiModalProps {}

const AiModal: React.FC<AiModalProps> = (props: AiModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiInstruction, setAiInstruction] = useState<string>('')
  const [aiProgress, setAiProgress] = useState<number>(0)

  const {
    executeAiInstructionHandler,
    isAiModalOpen,
    abortAiInstructionController,
    closeAiModal,
  } = useEditor() as EditorContextValue
  const { addTransientNotification } = useTransientNotification()

  const startAiButtonHandler = async (): Promise<void> => {
    setIsProcessing(true)

    try {
      await executeAiInstructionHandler(aiInstruction, setAiProgress)
    } catch (error) {
      // TODO add error details to notification
      addTransientNotification({
        id: Date.now().toString(),
        type: Actions.negative,
        title: 'AI processing failed',
        body: 'See browser console for details',
      })
      if (error instanceof Error) {
        console.error(error.message)
      } else {
        console.error(error)
      }
    } finally {
      setIsProcessing(false)
      setAiProgress(0)
    }
  }

  const primaryButton = (
    <StyledButton
      actionType={Actions.primary}
      size={Size.lg}
      disabled={isProcessing}
      onClick={startAiButtonHandler}
    >
      Process
    </StyledButton>
  )

  const closeButtonHandler = () => {
    if (isProcessing) {
      abortAiInstructionController.abort()
    }
    closeAiModal()
  }

  return (
    <Modal
      isOpen={isAiModalOpen}
      isCancelButtonDisabled={false}
      onClose={closeButtonHandler}
      title={'AI Assist'}
      primaryButton={primaryButton}
      iconName="InformationCircleIcon"
      iconBackground={Actions.neutral}
    >
      <TextareaInput
        placeholder={'Your OpenAI GPT-4 prompt...'}
        rows={25}
        value={aiInstruction}
        handleDataChangeEvent={setAiInstruction}
        disabled={isProcessing}
      />
      <p className={'mt-1 text-sm leading-relaxed text-color-light'}>
        Use is subject to the{' '}
        <a href={'https://openai.com/policies'} target={'_blank'}>
          OpenAI Terms of use
        </a>
        .
      </p>
      <p className={'mt-1 text-sm leading-relaxed text-rose-900'}>
        {isProcessing && `${aiProgress.toLocaleString()} characters received.`}
        &nbsp;
      </p>
    </Modal>
  )
}

export default AiModal
