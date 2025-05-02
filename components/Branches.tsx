import React from 'react'
import List from './List'
import { ListEntryProps } from './ListEntry'
import { Branch } from '@/lib/provider/provider'
import { commitsparkConfig } from '@commitspark-config'
import {
  EditingActivityId,
  RouteIdEntryTypesList,
} from '@/components/editing/types'

export interface BranchesProps {
  owner: string
  repository: string
  branches: Branch[]
  currentBranch: string | null
}

const Branches: React.FC<BranchesProps> = (props: BranchesProps) => {
  const { owner, repository } = props

  const editingActivity = commitsparkConfig.activities.find(
    (activity) => activity.id === EditingActivityId,
  )
  if (!editingActivity) {
    throw new Error('Cannot find editing activity')
  }

  const branchListEntries = props.branches.map(
    (branch) =>
      ({
        linkTarget: editingActivity.routeGenerator(RouteIdEntryTypesList, [
          owner,
          repository,
          branch.name,
        ]),
        linkContent: { id: branch.name },
        isCurrent: branch.name === props.currentBranch,
      } as ListEntryProps),
  )

  return <List entries={branchListEntries} />
}

export default Branches
