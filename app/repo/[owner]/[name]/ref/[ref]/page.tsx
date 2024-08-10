import React from 'react'
import Application, {
  Activity,
  Layout,
} from '../../../../../../components/shell/Application'
import PageHeading from '../../../../../../components/PageHeading'
import ContentTypes from '../../../../../../components/ContentTypes'
import BranchSelectorColumn from '../../../../../../components/shell/BranchSelectorColumn'
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

  const primaryColumn = (
    <Column
      pageHeading={
        <div className={'border-b app-border-color px-4'}>
          <PageHeading title={'Content types'} />
        </div>
      }
    >
      <ContentTypes
        owner={repositoryInfo.owner}
        repository={repositoryInfo.repository}
        gitRef={repositoryInfo.gitRef}
      />
    </Column>
  )

  const branchSelectorColumn = (
    <BranchSelectorColumn repositoryInfo={repositoryInfo} />
  )

  return (
    <Application
      layout={Layout.TwoColumn}
      activity={Activity.editing}
      repositoryInfo={repositoryInfo}
      primaryColumn={primaryColumn}
      asideColumn={branchSelectorColumn}
    />
  )
}
