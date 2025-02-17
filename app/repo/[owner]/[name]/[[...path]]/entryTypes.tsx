import { ReactNode } from 'react'
import { RepositoryRefInfo } from '@/components/context/EditorProvider'
import { getCookieSession } from '@/components/lib/session'
import { fetchSchemaString } from '@/components/lib/git-functions'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { GraphQLObjectType } from 'graphql/type'
import Column from '@/components/shell/Column'
import PageHeading from '@/components/PageHeading'
import EntryTypes from '@/components/EntryTypes'

export default async function renderEntryTypes(
  owner: string,
  name: string,
  path: string[],
): Promise<ReactNode> {
  const decodedRef = decodeURIComponent(path[1])
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
  const schema = makeExecutableSchema({
    typeDefs: schemaString,
  })

  let entryTypeNames: string[] = []

  // get all types annotated with @Entry directive
  mapSchema(schema, {
    [MapperKind.OBJECT_TYPE]: (
      objectType: GraphQLObjectType,
    ): GraphQLObjectType => {
      const entryDirective = getDirective(schema, objectType, 'Entry')?.[0]
      if (entryDirective) {
        entryTypeNames.push(objectType.name)
      }
      return objectType
    },
  })

  return (
    <Column
      pageHeading={
        <div className={'border-b app-border-color px-4'}>
          <PageHeading title={'Entry types'} />
        </div>
      }
    >
      <EntryTypes
        owner={repositoryInfo.owner}
        repository={repositoryInfo.repository}
        gitRef={repositoryInfo.gitRef}
        entryTypeNames={entryTypeNames}
      />
    </Column>
  )
}
