import { ReactNode } from 'react'
import {
  EditorProvider,
  RepositoryRefInfo,
} from '@/components/context/EditorProvider'
import { getCookieSession } from '@/components/lib/session'
import {
  fetchContent,
  fetchSchemaString,
  fetchTypeNameById,
} from '@/components/lib/git-functions'
import { assertIsString } from '@/components/lib/assert'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { isObjectType } from 'graphql/type'
import { createContentQueryFromNamedType } from '@/components/lib/query-factory'
import EntryEditor from '@/components/editor/EntryEditor'

export default async function renderEntryEditor(
  owner: string,
  name: string,
  path: string[],
): Promise<ReactNode> {
  const decodedRef = decodeURIComponent(path[1])
  const decodedEntryId = decodeURIComponent(path[3])

  const repositoryInfo: RepositoryRefInfo = {
    owner: owner,
    repository: name,
    gitRef: decodedRef,
  }

  const session = await getCookieSession()

  const schemaString = await fetchSchemaString(
    session,
    repositoryInfo.owner,
    repositoryInfo.repository,
    repositoryInfo.gitRef,
  )

  const typeName = await fetchTypeNameById(
    session,
    repositoryInfo.owner,
    repositoryInfo.repository,
    repositoryInfo.gitRef,
    decodedEntryId,
  )
  assertIsString(typeName)

  const schema = makeExecutableSchema({
    typeDefs: schemaString,
  })
  const type = schema.getType(typeName)
  if (!isObjectType(type)) {
    throw new Error(`Expected GraphQLObjectType for type "${typeName}".`)
  }

  const entryContentQuery = createContentQueryFromNamedType(type)
  const contentResponse = await fetchContent(
    session,
    repositoryInfo.owner,
    repositoryInfo.repository,
    repositoryInfo.gitRef,
    {
      query: `query ($id: ID!) {data: ${typeName}(id:$id) ${entryContentQuery}}`,
      variables: {
        id: decodedEntryId,
      },
    },
  )
  const entryData = contentResponse.data

  return (
    <EditorProvider
      entryProps={{
        schemaString: schemaString,
        isNewEntry: false,
      }}
      repositoryRefInfo={repositoryInfo}
    >
      <EntryEditor
        entryId={decodedEntryId}
        initialData={entryData}
        typeName={typeName}
      />
    </EditorProvider>
  )
}
