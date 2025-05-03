import React, { use, useEffect } from 'react'
import List from './List'
import { ListEntryProps } from './ListEntry'
import { Branch } from '@/lib/provider/provider'
import { commitsparkConfig } from '@commitspark-config'
import {
  EditingActivityId,
  RouteIdEntryTypesList,
} from '@/components/editing/types'
import { getCookieSession } from '@/components/lib/session'
import { fetchBranches } from '@/components/lib/git-functions'
import { useRepositoryInfo } from '@/components/context/RepositoryInfoProvider'

export interface BranchesProps {
  owner: string
  repository: string
  currentBranch: string | null
}

const Branches: React.FC<BranchesProps> = (props: BranchesProps) => {
  const { owner, repository } = props

  const repositoryInfo = useRepositoryInfo()

  const getData = async () => {
    if (
      !repositoryInfo ||
      !repositoryInfo.repository ||
      !repositoryInfo.owner
    ) {
      return []
    }

    const session = await getCookieSession()
    const branches = await fetchBranches(
      session,
      repositoryInfo.owner,
      repositoryInfo.repository,
    )
    // TODO
    // const currentBranch =
    //   cleanedPath.length >= 2 && cleanedPath[0] === 'ref'
    //     ? decodeURIComponent(cleanedPath[1])
    //     : null
    return []
  }

  const branches = use(getData())

  const editingActivity = commitsparkConfig.activities.find(
    (activity) => activity.id === EditingActivityId,
  )
  if (!editingActivity) {
    throw new Error('Cannot find editing activity')
  }

  const branchListEntries = branches.map(
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
