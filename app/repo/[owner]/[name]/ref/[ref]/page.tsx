import React from 'react'
import PageHeading from '../../../../../../components/PageHeading'
import EntryTypes from '../../../../../../components/EntryTypes'
import Column from '../../../../../../components/shell/Column'

export interface ContentTypesOverviewPageParams {
  owner: string
  name: string
  ref: string
}

export default function ContentTypesOverviewPage({
  params,
}: {
  params: ContentTypesOverviewPageParams
}) {
  const decodedRef = decodeURIComponent(params.ref)

  const repositoryInfo = {
    owner: params.owner,
    repository: params.name,
    gitRef: decodedRef,
  }

  return (
    <Column
      pageHeading={
        <div className={'border-b app-border-color px-4'}>
          <PageHeading title={'Entry types'} />
        </div>
      }
    >
      <EntryTypes
        owner={repositoryInfo.owner}
        repository={repositoryInfo.repository}
        gitRef={repositoryInfo.gitRef}
      />
    </Column>
  )
}
