'use client'

import React, { Suspense, useState } from 'react'
import StyledButton from '@/components/StyledButton'
import { Actions } from '@/components/StyledButtonEnums'
import { PlusIcon } from '@heroicons/react/24/solid'
import CreateBranchModal from '@/components/editing/CreateBranchModal'
import { getCookieSession } from '@/components/lib/session'
import { createBranch } from '@/components/lib/git-functions'
import { RepositoryRefInfo } from '@/components/context/EditorProvider'
import { editingActivity } from '@/components/editing/editingActivity'
import { RouteIdEntryTypesList } from '@/components/editing/types'
import { useRouter } from 'next/navigation'
import { Branch } from '@/lib/provider/provider'
import ModalLoading from '@/components/shell/ModalLoading'

interface CreateBranchButtonProps {
  currentBranchName: string
  repositoryInfo: RepositoryRefInfo
  branches: Promise<Branch[]>
}

const CreateBranchButton: React.FC<CreateBranchButtonProps> = (
  props: CreateBranchButtonProps,
) => {
  const [isCreateBranchModalOpen, setIsCreateBranchModalOpen] =
    useState<boolean>(false)
  const router = useRouter()

  const doCreateBranchHandler = async (
    sourceBranchName: string,
    branchName: string,
  ): Promise<string> => {
    const session = await getCookieSession()

    const result = await createBranch(
      session,
      props.repositoryInfo.owner,
      props.repositoryInfo.repository,
      sourceBranchName,
      branchName,
    )
    return result.name
  }

  const createBranchSuccessHandler = (branchName: string) => {
    const newBranchRoute = editingActivity.routeGenerator(
      RouteIdEntryTypesList,
      [props.repositoryInfo.owner, props.repositoryInfo.repository, branchName],
    )
    router.push(newBranchRoute)
  }

  const fallback = <>{isCreateBranchModalOpen && <ModalLoading />}</>

  return (
    <>
      <Suspense fallback={fallback}>
        <CreateBranchModal
          isOpen={isCreateBranchModalOpen}
          closeModalHandler={() => setIsCreateBranchModalOpen(false)}
          doCreateBranchHandler={doCreateBranchHandler}
          createBranchSuccessHandler={createBranchSuccessHandler}
          currentBranchName={props.currentBranchName}
          branches={props.branches}
        />
      </Suspense>
      <StyledButton
        actionType={Actions.neutral}
        onClick={(event) => {
          event.preventDefault()
          setIsCreateBranchModalOpen(true)
        }}
      >
        <PlusIcon className="icon-size self-center" />
      </StyledButton>
    </>
  )
}

export default CreateBranchButton
