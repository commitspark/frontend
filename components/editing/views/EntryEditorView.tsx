import React, { use } from 'react'
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

interface EntryEditorViewProps {
  owner: string
  name: string
  path: string[]
}

const EntryEditorView: React.FC<EntryEditorViewProps> = (
  props: EntryEditorViewProps,
) => {
  const decodedRef = decodeURIComponent(props.path[1])
  const decodedEntryId = decodeURIComponent(props.path[3])

  const getData = async () => {
    const repositoryInfo: RepositoryRefInfo = {
      owner: props.owner,
      repository: props.name,
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

    return {
      schemaString,
      repositoryInfo,
      entryData: contentResponse.data,
      typeName,
    }
  }

  const data = use(getData())

  return (
    <div className="flex-grow mx-auto max-w-6xl">
      <EditorProvider
        entryProps={{
          schemaString: data.schemaString,
          isNewEntry: false,
        }}
        repositoryRefInfo={data.repositoryInfo}
      >
        <EntryEditor
          entryId={decodedEntryId}
          initialData={data.entryData}
          typeName={data.typeName}
        />
      </EditorProvider>
    </div>
  )
}

export default EntryEditorView
