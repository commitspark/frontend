import React from 'react'
import Application, {
  Activity,
  Layout,
} from '../../../../components/shell/Application'
import BranchSelectorColumn from '../../../../components/shell/BranchSelectorColumn'

interface LayoutProps {
  params: Promise<LayoutParams>
}

interface LayoutParams {
  owner: string
  name: string
}

export default async function RefSpecificLayout(
  props: React.PropsWithChildren<LayoutProps>,
) {
  const params = await props.params

  const repositoryInfo = {
    owner: params.owner,
    repository: params.name,
  }

  const branchSelectorColumn = (
    <BranchSelectorColumn repositoryInfo={repositoryInfo} />
  )

  return (
    <Application
      layout={Layout.TwoColumn}
      activity={Activity.editing}
      repositoryInfo={repositoryInfo}
      asideColumn={branchSelectorColumn}
    >
      {props.children}
    </Application>
  )
}
