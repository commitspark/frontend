'use client'

import { useEffect, useState } from 'react'
import { getApiService } from '@commitspark/graphql-api'
import { getAdapter } from './lib/getAdapter'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { GraphQLObjectType, GraphQLSchema } from 'graphql/type'
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import Loading from './Loading'
import List from './List'
import { ListEntryProps } from './ListEntry'
import { routes } from './lib/route-generator'
import { commitsparkConfig } from '../commitspark.config'

export interface ContentTypesProps {
  owner: string
  repository: string
  gitRef: string
}

const ContentTypes: React.FC<ContentTypesProps> = (
  props: ContentTypesProps,
) => {
  const [entryTypes, setEntryTypes] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchTypes() {
      setEntryTypes([])
      const token = await commitsparkConfig.createAuthenticator().getToken()
      const apiService = await getApiService()
      const adapter = await getAdapter(token, props.owner, props.repository)
      const response = await apiService.getSchema(adapter, props.gitRef)

      const schema = makeExecutableSchema({
        typeDefs: response.data,
      })

      if (!ignore) {
        setEntryTypes(getEntryTypes(schema))
        setLoading(false)
      }
    }

    let ignore = false
    fetchTypes()
    return () => {
      ignore = true
    }
  }, [props.owner, props.repository, props.gitRef])

  const contentTypesListEntries = entryTypes.map(
    (entryType: string) =>
      ({
        linkTarget: routes.contentEntriesOfTypeList(
          props.owner,
          props.repository,
          props.gitRef,
          entryType,
        ),
        linkContent: { name: entryType },
      } as ListEntryProps),
  )

  return (
    <>
      {loading && <Loading />}
      {!loading && <List entries={contentTypesListEntries} />}
    </>
  )
}

export default ContentTypes

function getEntryTypes(schema: GraphQLSchema): string[] {
  const result: string[] = []

  // get all types annotated with @Entry directive
  mapSchema(schema, {
    [MapperKind.OBJECT_TYPE]: (
      objectType: GraphQLObjectType,
    ): GraphQLObjectType => {
      const entryDirective = getDirective(schema, objectType, 'Entry')?.[0]
      if (entryDirective) {
        result.push(objectType.name)
      }
      return objectType
    },
  })

  return result
}
