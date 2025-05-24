import React, { Suspense } from 'react'
import BranchesSelectorInner from '@/components/editing/BranchesSelectorInner'
import { RepositoryRefInfo } from '@/components/context/EditorProvider'
import SelectMenuLoading from '@/components/SelectMenuLoading'
import { Branch } from '@/lib/provider/provider'

export interface BranchesSelectorProps {
  repositoryInfo: RepositoryRefInfo
  branches: Promise<Branch[]>
}

const BranchesSelector: React.FC<BranchesSelectorProps> = (
  props: BranchesSelectorProps,
) => {
  return (
    <Suspense fallback={<SelectMenuLoading />}>
      <BranchesSelectorInner
        repositoryInfo={props.repositoryInfo}
        branches={props.branches}
      />
    </Suspense>
  )
}

export default BranchesSelector
