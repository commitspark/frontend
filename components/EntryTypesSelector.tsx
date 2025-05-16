import React from 'react'
import { RepositoryRefInfo } from '@/components/context/EditorProvider'
import { getCookieSession } from '@/components/lib/session'
import { fetchSchemaString } from '@/components/lib/git-functions'
import EntryTypesSelectorInner from '@/components/EntryTypesSelectorInner'

interface EntryTypesSelectorProps {
  repositoryInfo: RepositoryRefInfo
}

const EntryTypesSelector: React.FC<EntryTypesSelectorProps> = (
  props: EntryTypesSelectorProps,
) => {
  const getData = async (): Promise<string> => {
    const session = await getCookieSession()
    return fetchSchemaString(
      session,
      props.repositoryInfo.owner,
      props.repositoryInfo.repository,
      props.repositoryInfo.gitRef,
    )
  }

  return <EntryTypesSelectorInner graphQLSchemaString={getData()} />
}

export default EntryTypesSelector
