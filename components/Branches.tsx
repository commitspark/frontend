'use client'

import { getCookie } from 'cookies-next'
import { COOKIE_PROVIDER_TOKEN_GITHUB } from '../lib/cookies'
import React, { useEffect, useState } from 'react'
import List from './List'
import Loading from './Loading'
import { ListEntryProps } from './ListEntry'
import { routes } from './lib/route-generator'
import { Branch } from '../lib/provider/provider'
import { commitsparkConfig } from '../commitspark.config'

export interface BranchesProps {
  provider: string
  owner: string
  repository: string
  currentBranchName: string | null
}

const Branches: React.FC<BranchesProps> = (props: BranchesProps) => {
  const token = `${getCookie(COOKIE_PROVIDER_TOKEN_GITHUB)}`
  const [branches, setBranches] = useState([] as Branch[])
  const [loading, setLoading] = useState<boolean>(true)

  // TODO use useMemo() to cache results
  useEffect(() => {
    async function fetchBranches() {
      setBranches([])
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
  }, [token])

  const branchListEntries = branches.map(
    (branch) =>
      ({
        linkTarget: routes.contentTypesList(
          props.provider,
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
