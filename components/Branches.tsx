'use client'

import React, { useEffect, useState } from 'react'
import List from './List'
import Loading from './Loading'
import { ListEntryProps } from './ListEntry'
import { routes } from './lib/route-generator'
import { Branch } from '../lib/provider/provider'
import { useSelectedLayoutSegments } from 'next/navigation'
import { fetchBranches } from '../app/server-actions/actions'
import { getCookieSession } from './lib/session'

export interface BranchesProps {
  owner: string
  repository: string
}

const Branches: React.FC<BranchesProps> = (props: BranchesProps) => {
  const { owner, repository } = props
  const [branches, setBranches] = useState([] as Branch[])
  const [loading, setLoading] = useState<boolean>(true)

  // `segments` contains paths starting at nearest parent layout; 0 = `ref`, 1 = value of `[ref]`, ...;
  // see https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segments
  const segments = useSelectedLayoutSegments()
  const decodedGitRef = decodeURIComponent(segments[1])

  useEffect(() => {
    const updateBranches = async () => {
      setLoading(true)
      const session = getCookieSession()
      const branches = await fetchBranches(session, owner, repository)
      setBranches(branches)
      setLoading(false)
    }

    updateBranches()

    return () => {}
  }, [owner, repository])

  const branchListEntries = branches.map(
    (branch) =>
      ({
        linkTarget: routes.contentTypesList(owner, repository, branch.name),
        linkContent: { id: branch.name },
        isCurrent: branch.name === decodedGitRef,
      } as ListEntryProps),
  )

  return (
    <>
      {loading && <Loading />}
      {!loading && <List entries={branchListEntries} />}
    </>
  )
}

export default Branches
