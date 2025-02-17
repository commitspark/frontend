import React from 'react'
import List from './List'
import { ListEntryProps } from './ListEntry'
import { routes } from './lib/route-generator'
import { Branch } from '@/lib/provider/provider'

export interface BranchesProps {
  owner: string
  repository: string
  branches: Branch[]
  currentBranch: string | null
}

const Branches: React.FC<BranchesProps> = (props: BranchesProps) => {
  const { owner, repository } = props

  const branchListEntries = props.branches.map(
    (branch) =>
      ({
        linkTarget: routes.entryTypesList(owner, repository, branch.name),
        linkContent: { id: branch.name },
        isCurrent: branch.name === props.currentBranch,
      } as ListEntryProps),
  )

  return <List entries={branchListEntries} />
}

export default Branches
