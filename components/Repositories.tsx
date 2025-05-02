import React from 'react'
import List from './List'
import { ListEntryProps } from './ListEntry'
import { routes } from './lib/route-generator'
import { Repository } from '@/lib/provider/provider'
import { commitsparkConfig } from '@commitspark-config'

export interface RepositoriesProps {
  repositories: Repository[]
}

const Repositories: React.FC<RepositoriesProps> = (
  props: RepositoriesProps,
) => {
  const repoListEntries = props.repositories.map((repository) => {
    const provider = commitsparkConfig.createProvider()
    return {
      linkTarget: routes.defaultActivity(repository.owner, repository.name),
      linkContent: { id: provider.toFullName(repository) },
    } as ListEntryProps
  })

  return (
    <div className={'pt-2'}>
      <List entries={repoListEntries} />
    </div>
  )
}

export default Repositories
