import React, { Suspense } from 'react'
import { getCookieSession } from '@/components/lib/session'
import { fetchBranches } from '@/components/lib/git-functions'
import BranchesSelectorInner from '@/components/BranchesSelectorInner'
import { RepositoryRefInfo } from '@/components/context/EditorProvider'
import SelectMenuLoading from '@/components/SelectMenuLoading'

export interface BranchesSelectorProps {
  repositoryInfo: RepositoryRefInfo
}

const BranchesSelector: React.FC<BranchesSelectorProps> = (
  props: BranchesSelectorProps,
) => {
  const getBranches = async () => {
    const session = await getCookieSession()
    return fetchBranches(
      session,
      props.repositoryInfo.owner,
      props.repositoryInfo.repository,
    )
  }

  return (
    <Suspense fallback={<SelectMenuLoading />}>
      <BranchesSelectorInner
        repositoryInfo={props.repositoryInfo}
        branches={getBranches()}
      />
    </Suspense>
  )
}

export default BranchesSelector
