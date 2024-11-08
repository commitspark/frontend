import React from 'react'
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

  return (
    <EditorProvider
      entryProps={{
        typeName: params.typeName,
        entryId: undefined,
      }}
      repositoryRefInfo={repositoryInfo}
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
}
