import React from 'react'
import PageHeading from '../../../../../../components/PageHeading'
import EntryTypes from '../../../../../../components/EntryTypes'
import Column from '../../../../../../components/shell/Column'
import { RepositoryRefInfo } from '../../../../../../components/context/EditorProvider'
import { getCookieSession } from '../../../../../../components/lib/session'
import { fetchSchemaString } from '../../../../../../components/lib/git-functions'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { GraphQLObjectType } from 'graphql/type'

export interface EntryTypesOverviewPageParams {
  owner: string
  name: string
  ref: string
}

export const dynamic = 'force-dynamic'

export default async function EntryTypesOverviewPage({
  params,
}: {
  params: EntryTypesOverviewPageParams
}) {
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
