'use client'

import { getCookie } from 'cookies-next'
import { COOKIE_PROVIDER_TOKEN_GITHUB } from '../lib/cookies'
import React, { useEffect, useState } from 'react'
import { Octokit } from 'octokit'
import { Repository } from '@octokit/webhooks-types'
import Loading from './Loading'
import List from './List'
import { ListEntryProps } from './ListEntry'
import { routes } from './lib/route-generator'

export interface RepositoriesProps {
  provider: string
}

const Repositories: React.FC<RepositoriesProps> = (
  props: RepositoriesProps,
) => {
  const token = `${getCookie(COOKIE_PROVIDER_TOKEN_GITHUB)}`
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchRepositories() {
      setRepositories([])
      const octokit = new Octokit({ auth: token })
      const response = await octokit.request('GET /user/repos')
      if (!ignore) {
        setRepositories(response.data as Repository[])
        setLoading(false)
      }
    }

    let ignore = false
    fetchRepositories()
    return () => {
      ignore = true
    }
  }, [token])

  const repoListEntries = repositories.map((repository) => {
    const [owner, repositoryName] = repository.full_name.split('/')
    return {
      linkTarget: routes.editingStartScreen(
        props.provider,
        owner,
        repositoryName,
      ),
      linkContent: { id: repository.full_name },
    } as ListEntryProps
  })

  return (
    <div className={'pt-2'}>
      {loading && <Loading />}
      {!loading && <List entries={repoListEntries} />}
    </div>
  )
}

export default Repositories
