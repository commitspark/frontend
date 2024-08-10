import EntryEditor from '../../../../../../../../components/editor/EntryEditor'
import React from 'react'
import Application, {
  Activity,
  Layout,
} from '../../../../../../../../components/shell/Application'
import BranchSelectorColumn from '../../../../../../../../components/shell/BranchSelectorColumn'
import { EditorProvider } from '../../../../../../../../components/context/EditorProvider'

interface PageParams {
  owner: string
  name: string
  ref: string
  entryId: string
}

export default async function Page({ params }: { params: PageParams }) {
  const decodedRef = decodeURIComponent(params.ref)

  const repositoryInfo = {
    owner: params.owner,
    repository: params.name,
    gitRef: decodedRef,
  }

  const primaryColumn = (
    <EditorProvider entryProps={{ ...repositoryInfo, entryId: params.entryId }}>
      <EntryEditor
        owner={params.owner}
        repository={params.name}
        gitRef={decodedRef}
        entryId={params.entryId}
      />
    </EditorProvider>
  )

  const branchSelectorColumn = (
    <BranchSelectorColumn repositoryInfo={repositoryInfo} />
  )

  return (
    <Application
      repositoryInfo={repositoryInfo}
      activity={Activity.editing}
      layout={Layout.TwoColumn}
      primaryColumn={primaryColumn}
      asideColumn={branchSelectorColumn}
    />
  )
}
