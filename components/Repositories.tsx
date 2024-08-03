'use client'

import { getCookie } from 'cookies-next'
import { COOKIE_PROVIDER_TOKEN_GITHUB } from '../lib/cookies'
import React, { useEffect, useState } from 'react'
import Loading from './Loading'
import List from './List'
import { ListEntryProps } from './ListEntry'
import { routes } from './lib/route-generator'
import { Repository } from '../lib/provider/provider'
import { commitsparkConfig } from '../commitspark.config'

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
      const provider = commitsparkConfig.createProvider()
      const repositories = await provider.getRepositories(token)
      if (!ignore) {
        setRepositories(repositories)
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
    const provider = commitsparkConfig.createProvider()
    return {
      linkTarget: routes.editingStartScreen(
        props.provider,
        repository.owner,
        repository.name,
      ),
      linkContent: { id: provider.toFullName(repository) },
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
