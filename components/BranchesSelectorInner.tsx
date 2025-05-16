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

export interface BranchesSelectorProps {
  owner: string
  repository: string
  currentBranch: string | null
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
        props.owner,
        props.repository,
        branch.name,
      ]),
    }),
  )

  return (
    <SelectMenu
      entries={menuEntries}
      selectedId={props.currentBranch ?? ''}
      prefixIcon={<BranchIcon />}
    />
  )
}

export default BranchesSelector
