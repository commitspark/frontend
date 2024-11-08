'use client'

import React, { useEffect, useState } from 'react'
import List from './List'
import Loading from './Loading'
import { ListEntryProps } from './ListEntry'
import { routes } from './lib/route-generator'
import { Branch } from '../lib/provider/provider'
import { commitsparkConfig } from '../commitspark.config'
import { useSelectedLayoutSegments } from 'next/navigation'

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
    async function fetchBranches() {
      setBranches([])
      const token = await commitsparkConfig.createAuthenticator().getToken()
      const provider = commitsparkConfig.createProvider()
      const branches = await provider.getBranches(token, {
        owner: owner,
        name: repository,
      })
      if (!ignore) {
        setBranches(branches)
        setLoading(false)
      }
    }

    let ignore = false
    fetchBranches()
    return () => {
      ignore = true
    }
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
