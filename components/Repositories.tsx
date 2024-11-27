'use client'

import React, { useEffect, useState } from 'react'
import Loading from './Loading'
import List from './List'
import { ListEntryProps } from './ListEntry'
import { routes } from './lib/route-generator'
import { Repository } from '../lib/provider/provider'
import { commitsparkConfig } from '../commitspark.config'
import { fetchRepositories } from '../app/server-actions/actions'
import { getCookieSession } from './lib/session'

export interface RepositoriesProps {}

const Repositories: React.FC<RepositoriesProps> = (
  props: RepositoriesProps,
) => {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const updateRepositories = async (): Promise<void> => {
      setIsLoading(true)
      const session = getCookieSession()
      const repositories = await fetchRepositories(session)
      setRepositories(repositories)
      setIsLoading(false)
    }

    updateRepositories()

    return () => {}
  }, [])

  const repoListEntries = repositories.map((repository) => {
    const provider = commitsparkConfig.createProvider()
    return {
      linkTarget: routes.editingStartScreen(repository.owner, repository.name),
      linkContent: { id: provider.toFullName(repository) },
    } as ListEntryProps
  })

  return (
    <div className={'pt-2'}>
      {isLoading && <Loading />}
      {!isLoading && <List entries={repoListEntries} />}
    </div>
  )
}

export default Repositories
