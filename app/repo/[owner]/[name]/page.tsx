import React from 'react'
import Application, {
  Activity,
  Layout,
} from '../../../../components/shell/Application'
import BranchSelectorColumn from '../../../../components/shell/BranchSelectorColumn'

interface RepositoryPageParams {
  provider: string
  owner: string
  name: string
}

// TODO remove this page and instead send users directly to a default branch, e.g. `main`
export default function RepositoryPage({
  params,
}: {
  params: RepositoryPageParams
}) {
  const repositoryInfo = {
    provider: params.provider,
    owner: params.owner,
    repository: params.name,
    gitRef: null,
  }
  const branchSelectorColumn = (
    <BranchSelectorColumn repositoryInfo={repositoryInfo} />
  )
  return (
    <Application
      layout={Layout.TwoColumn}
      activity={Activity.editing}
      repositoryInfo={repositoryInfo}
      primaryColumn={<></>}
      asideColumn={branchSelectorColumn}
    />
  )
}
