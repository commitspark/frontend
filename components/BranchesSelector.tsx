import React from 'react'
import { getCookieSession } from '@/components/lib/session'
import { fetchBranches } from '@/components/lib/git-functions'
import BranchesSelectorInner from '@/components/BranchesSelectorInner'

export interface BranchesSelectorProps {
  owner: string
  repository: string
  currentBranch: string | null
}

const BranchesSelector: React.FC<BranchesSelectorProps> = (
  props: BranchesSelectorProps,
) => {
  const getBranches = async () => {
    const session = await getCookieSession()
    return fetchBranches(session, props.owner, props.repository)
  }

  return (
    <BranchesSelectorInner
      owner={props.owner}
      repository={props.repository}
      branches={getBranches()}
      currentBranch={props.currentBranch}
    />
  )
}

export default BranchesSelector
