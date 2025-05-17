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
            <h1 className="pb-2 font-semibold text-color">Repositories</h1>
            <Repositories repositories={repositories} />
          </div>
        </div>
      </main>
    </>
  )
}
