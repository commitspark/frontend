'use client'

import { getCookie } from 'cookies-next'
import { COOKIE_PROVIDER_TOKEN_GITHUB } from '../lib/cookies'
import React, { useEffect, useState } from 'react'
import { Octokit } from 'octokit'
import List from './List'
import Loading from './Loading'
import { ListEntryProps } from './ListEntry'
import { routes } from './lib/route-generator'

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
      const octokit = new Octokit({ auth: token })
      const response = await octokit.request(
        `GET /repos/${props.owner}/${props.repository}/branches`,
        {
          request: {
            // don't use cache for now to make sure branches are always up-to-date; see https://github.com/octokit/octokit.js/issues/890
            cache: 'reload',
          },
        },
      )
      if (!ignore) {
        setBranches(response.data as Branch[])
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

interface Branch {
  name: string
  protected: boolean
  commit: Commit
}

interface Commit {
  sha: string
  url: string
}
