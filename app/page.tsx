import Application, { Layout } from '../components/shell/Application'
import PageHeading from '../components/PageHeading'
import Repositories from '../components/Repositories'
import React from 'react'
import { getCookieSession } from '@/components/lib/session'
import { fetchRepositories } from '@/components/lib/git-functions'

export interface RepositoriesListPageParams {}

export default async function RepositoriesListPage({
  params,
}: {
  params: Promise<RepositoriesListPageParams>
}) {
  const session = await getCookieSession()
  const repositories = await fetchRepositories(session)

  const primaryColumn = (
    <main className={'overflow-auto min-w-0 flex-1'}>
      <div className={'p-6 space-y-8'}>
        <div>
          <div className={'border-b app-border-color'}>
            <PageHeading title={'Repositories'} />
          </div>
          <Repositories repositories={repositories} />
        </div>
      </div>
    </main>
  )

  return (
    <Application
      layout={Layout.SingleArea}
      activities={{
        availableActivities: [],
        idCurrentActivity: '',
      }}
      repositoryInfo={{
        owner: null,
        repository: null,
      }}
      asideColumn={null}
    >
      {primaryColumn}
    </Application>
  )
}
