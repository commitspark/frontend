import React from 'react'
import Application, {
  Activity,
  Layout,
} from '../../../../../../../../../components/shell/Application'
import BranchSelectorColumn from '../../../../../../../../../components/shell/BranchSelectorColumn'
import { EditorProvider } from '../../../../../../../../../components/context/EditorProvider'
import EntryEditor from '../../../../../../../../../components/editor/EntryEditor'

interface PageParams {
  owner: string
  name: string
  ref: string
  typeName: string
}

export default async function Page({ params }: { params: PageParams }) {
  const decodedRef = decodeURIComponent(params.ref)

  const repositoryInfo = {
    owner: params.owner,
    repository: params.name,
    gitRef: decodedRef,
  }

  const primaryColumn = (
    <EditorProvider
      entryProps={{ ...repositoryInfo, typeName: params.typeName }}
    >
      <EntryEditor
        owner={params.owner}
        repository={params.name}
        gitRef={decodedRef}
        entryId={undefined}
        typeName={params.typeName}
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
