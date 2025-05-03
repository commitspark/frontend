import PageHeading from '../components/PageHeading'
import Repositories from '../components/Repositories'
import React from 'react'
import { getCookieSession } from '@/components/lib/session'
import { fetchRepositories } from '@/components/lib/git-functions'
import Navbar from '@/components/shell/Navbar'

export interface RepositoriesListPageParams {}

export default async function RepositoriesListPage({
  params,
}: {
  params: Promise<RepositoriesListPageParams>
}) {
  const session = await getCookieSession()
  const repositories = await fetchRepositories(session)

  return (
    <>
      <Navbar />
      <main className={''}>
        <div className={'p-6 space-y-8'}>
          <div>
            <div className={'border-b app-border-color'}>
              <PageHeading title={'Repositories'} />
            </div>
            <Repositories repositories={repositories} />
          </div>
        </div>
      </main>
    </>
  )
}
