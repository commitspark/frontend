'use client'

import React, { use } from 'react'
import { Branch } from '@/lib/provider/provider'
import { commitsparkConfig } from '@commitspark-config'
import {
  EditingActivityId,
  RouteIdEntryTypesList,
} from '@/components/editing/types'
import SelectMenu from '@/components/SelectMenu'
import { DropDownEntryProps } from '@/components/DropDownEntry'
import BranchIcon from '@/components/editing/icons/BranchIcon'
import { RepositoryRefInfo } from '@/components/context/EditorProvider'

export interface BranchesSelectorProps {
  repositoryInfo: RepositoryRefInfo
  branches: Promise<Branch[]>
}

const BranchesSelector: React.FC<BranchesSelectorProps> = (
  props: BranchesSelectorProps,
) => {
  const editingActivity = commitsparkConfig.activities.find(
    (activity) => activity.id === EditingActivityId,
  )
  if (!editingActivity) {
    throw new Error('Cannot find editing activity')
  }

  const branches = use(props.branches)

  const menuEntries = branches.map(
    (branch): DropDownEntryProps => ({
      label: branch.name,
      target: editingActivity.routeGenerator(RouteIdEntryTypesList, [
        props.repositoryInfo.owner,
        props.repositoryInfo.repository,
        branch.name,
      ]),
    }),
  )

  return (
    <SelectMenu
      entries={menuEntries}
      selectedId={props.repositoryInfo.gitRef ?? ''}
      prefixIcon={<BranchIcon />}
    />
  )
}

export default BranchesSelector
