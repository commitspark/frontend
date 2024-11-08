import EntryEditor from '../../../../../../../../components/editor/EntryEditor'
import React from 'react'
import { EditorProvider } from '../../../../../../../../components/context/EditorProvider'

interface PageParams {
  owner: string
  name: string
  ref: string
  entryId: string
}

export default async function Page({ params }: { params: PageParams }) {
  const decodedRef = decodeURIComponent(params.ref)
  const decodedEntryId = decodeURIComponent(params.entryId)

  const repositoryInfo = {
    owner: params.owner,
    repository: params.name,
    gitRef: decodedRef,
  }

  return (
    <EditorProvider
      entryProps={{ entryId: decodedEntryId }}
      repositoryRefInfo={repositoryInfo}
    >
      <EntryEditor
        owner={params.owner}
        repository={params.name}
        gitRef={decodedRef}
        entryId={decodedEntryId}
      />
    </EditorProvider>
  )
}
