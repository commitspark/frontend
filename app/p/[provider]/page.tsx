import Application, { Layout } from '../../../components/shell/Application'
import PageHeading from '../../../components/PageHeading'
import Repositories from '../../../components/Repositories'
import React from 'react'

export interface ProviderPageParams {
  provider: string
}

export default function ProviderPage({
  params,
}: {
  params: ProviderPageParams
}) {
  const primaryColumn = (
    <main className={'overflow-auto min-w-0 flex-1'}>
      <div className={'p-6 space-y-8'}>
        <div>
          <div className={'border-b app-border-color'}>
            <PageHeading title={'Repositories'} />
          </div>
          <Repositories provider={params.provider} />
        </div>
      </div>
    </main>
  )

  return (
    <Application
      layout={Layout.SingleArea}
      activity={null}
      repositoryInfo={{
        provider: params.provider,
        owner: null,
        repository: null,
        gitRef: null,
      }}
      primaryColumn={primaryColumn}
      asideColumn={null}
    />
  )
}
