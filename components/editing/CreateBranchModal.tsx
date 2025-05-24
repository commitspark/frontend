'use client'

import React, { use, useState } from 'react'
import StyledButton from '../StyledButton'
import { Actions, Size } from '../StyledButtonEnums'
import Modal from '../shell/Modal'
import { useTransientNotification } from '../context/TransientNotificationProvider'
import TextInput from '@/components/styledInput/TextInput'
import { Branch } from '@/lib/provider/provider'
import { DropDownEntryProps } from '@/components/DropDownEntry'
import SelectMenu from '@/components/SelectMenu'
import BranchIcon from '@/components/editing/icons/BranchIcon'

interface CreateBranchModalProps {
  isOpen: boolean
  closeModalHandler: () => void
  doCreateBranchHandler: (
    sourceBranchName: string,
    branchName: string,
  ) => Promise<string>
  createBranchSuccessHandler: (branchName: string) => void
  // TODO add createBranchErrorHandler so that notifications don't need to be handled here
  currentBranchName: string
  branches: Promise<Branch[]>
}

const CreateBranchModal: React.FC<CreateBranchModalProps> = (
  props: CreateBranchModalProps,
) => {
  const [sourceBranchName, setSourceBranchName] = useState<string>(
    props.currentBranchName,
  )
  const [newBranchName, setNewBranchName] = useState<string>('')
  const [isCreating, setIsCreating] = useState(false)
  const { addTransientNotification } = useTransientNotification()

  const createButtonHandler = async (): Promise<void> => {
    setIsCreating(true)

    let createdBranchName: string | null = null
    try {
      createdBranchName = await props.doCreateBranchHandler(
        sourceBranchName,
        newBranchName,
      )
    } catch (error) {
      // TODO add error details to notification
      addTransientNotification({
        id: Date.now().toString(),
        type: Actions.negative,
        title: 'Create failed',
        body: 'See browser console for details',
      })
      if (error instanceof Error) {
        console.error(error.message)
      } else {
        console.error(error)
      }
    } finally {
      props.closeModalHandler()
      setIsCreating(false)
    }

    if (createdBranchName) {
      props.createBranchSuccessHandler(createdBranchName)
    }
  }

  const branches = use(props.branches)
  const menuEntries: DropDownEntryProps[] = branches.map(
    (branch): DropDownEntryProps => {
      return {
        label: branch.name,
        onClickHandler: () => setSourceBranchName(branch.name),
      }
    },
  )

  const primaryButton = (
    <StyledButton
      actionType={Actions.primary}
      size={Size.lg}
      disabled={isCreating}
      onClick={createButtonHandler}
    >
      Create
    </StyledButton>
  )

  return (
    <Modal
      isOpen={props.isOpen}
      isCancelButtonDisabled={isCreating}
      onClose={() => !isCreating && props.closeModalHandler()}
      title={'Create branch'}
      primaryButton={primaryButton}
      iconName="InformationCircleIcon"
      iconBackground={Actions.positive}
    >
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-1">
          <label
            htmlFor="branchName"
            className="block text-sm text-color font-medium"
          >
            New branch name
          </label>
          <TextInput
            name="branchName"
            placeholder={'feature/my-feature'}
            value={newBranchName}
            handleDataChangeEvent={setNewBranchName}
            disabled={isCreating}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label
            htmlFor="sourceBranchName"
            className="block text-sm text-color font-medium"
          >
            Source branch
          </label>
          <SelectMenu
            entries={menuEntries}
            selectedId={sourceBranchName}
            prefixIcon={<BranchIcon />}
            disabled={isCreating}
          />
        </div>
      </div>
    </Modal>
  )
}

export default CreateBranchModal
