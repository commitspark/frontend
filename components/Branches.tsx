'use client'

import React from 'react'
import List from './List'
import { ListEntryProps } from './ListEntry'
import { routes } from './lib/route-generator'
import { Branch } from '../lib/provider/provider'
import { useSelectedLayoutSegments } from 'next/navigation'

export interface BranchesProps {
  owner: string
  repository: string
  branches: Branch[]
}

const Branches: React.FC<BranchesProps> = (props: BranchesProps) => {
  const { owner, repository } = props

  // `segments` contains paths starting at nearest parent layout; 0 = `ref`, 1 = value of `[ref]`, ...;
  // see https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segments
  const segments = useSelectedLayoutSegments()
  const decodedGitRef = decodeURIComponent(segments[1])

  const branchListEntries = props.branches.map(
    (branch) =>
      ({
        linkTarget: routes.entryTypesList(owner, repository, branch.name),
        linkContent: { id: branch.name },
        isCurrent: branch.name === decodedGitRef,
      } as ListEntryProps),
  )

  return <List entries={branchListEntries} />
}

export default Branches
