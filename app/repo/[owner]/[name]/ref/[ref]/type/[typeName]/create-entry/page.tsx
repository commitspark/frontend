import React from 'react'
import {
  EditorProvider,
  RepositoryRefInfo,
} from '../../../../../../../../../components/context/EditorProvider'
import EntryEditor from '../../../../../../../../../components/editor/EntryEditor'
import { getCookieSession } from '../../../../../../../../../components/lib/session'
import { fetchSchemaString } from '../../../../../../../../../components/lib/git-functions'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { isObjectType } from 'graphql/type'
import { createDefaultData } from '../../../../../../../../../components/lib/default-data-generator'
import { assertIsRecordOrNull } from '../../../../../../../../../components/lib/assert'

interface PageParams {
  owner: string
  name: string
  ref: string
  typeName: string
}

export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: PageParams }) {
  const decodedRef = decodeURIComponent(params.ref)

  const repositoryInfo: RepositoryRefInfo = {
    owner: params.owner,
    repository: params.name,
    gitRef: decodedRef,
  }

  const session = await getCookieSession()

  const schemaString = await fetchSchemaString(
    session,
    repositoryInfo.owner,
    repositoryInfo.repository,
    repositoryInfo.gitRef,
  )

  const schema = makeExecutableSchema({
    typeDefs: schemaString,
  })
  const type = schema.getType(params.typeName)
  if (!isObjectType(type)) {
    throw new Error(`Expected GraphQLObjectType for type "${params.typeName}".`)
  }

  const entryData = createDefaultData(type, 0)
  assertIsRecordOrNull(entryData)
  if (entryData === null) {
    throw new Error('Expected non-null default data for new entry')
  }

  return (
    <EditorProvider
      entryProps={{
        schemaString: schemaString,
        isNewEntry: true,
      }}
      repositoryRefInfo={repositoryInfo}
    >
      <EntryEditor
        entryId={undefined}
        typeName={params.typeName}
        initialData={entryData}
      />
    </EditorProvider>
  )
}
