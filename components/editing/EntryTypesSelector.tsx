import React, { Suspense } from 'react'
import { RepositoryRefInfo } from '@/components/context/EditorProvider'
import { getCookieSession } from '@/components/lib/session'
import { fetchSchemaString } from '@/components/lib/git-functions'
import EntryTypesSelectorInner from '@/components/editing/EntryTypesSelectorInner'
import SelectMenuLoading from '@/components/SelectMenuLoading'

interface EntryTypesSelectorProps {
  repositoryInfo: RepositoryRefInfo
  currentTypeName: string
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

  return (
    <Suspense fallback={<SelectMenuLoading />}>
      <EntryTypesSelectorInner
        repositoryInfo={props.repositoryInfo}
        graphQLSchemaString={getData()}
        currentTypeName={props.currentTypeName}
      />
    </Suspense>
  )
}

export default EntryTypesSelector
