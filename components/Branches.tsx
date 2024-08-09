'use client'

import React, { useEffect, useState } from 'react'
import List from './List'
import Loading from './Loading'
import { ListEntryProps } from './ListEntry'
import { routes } from './lib/route-generator'
import { Branch } from '../lib/provider/provider'
import { commitsparkConfig } from '../commitspark.config'

export interface BranchesProps {
  owner: string
  repository: string
  currentBranchName: string | null
}

const Branches: React.FC<BranchesProps> = (props: BranchesProps) => {
  const [branches, setBranches] = useState([] as Branch[])
  const [loading, setLoading] = useState<boolean>(true)

  // TODO use useMemo() to cache results
  useEffect(() => {
    async function fetchBranches() {
      setBranches([])
      const token = await commitsparkConfig.createAuthenticator().getToken()
      const provider = commitsparkConfig.createProvider()
      const branches = await provider.getBranches(token, {
        owner: props.owner,
        name: props.repository,
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
  }, [props.owner, props.repository])

  const branchListEntries = branches.map(
    (branch) =>
      ({
        linkTarget: routes.contentTypesList(
          props.owner,
          props.repository,
          branch.name,
        ),
        linkContent: { id: branch.name },
        isCurrent: branch.name === props.currentBranchName,
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
