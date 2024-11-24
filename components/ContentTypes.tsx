'use client'

import { useEffect, useState } from 'react'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { GraphQLObjectType, GraphQLSchema } from 'graphql/type'
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import Loading from './Loading'
import List from './List'
import { ListEntryProps } from './ListEntry'
import { routes } from './lib/route-generator'
import { commitsparkConfig } from '../commitspark.config'
import { fetchSchemaString } from '../app/server-actions/actions'

export interface ContentTypesProps {
  owner: string
  repository: string
  gitRef: string
}

const ContentTypes: React.FC<ContentTypesProps> = (
  props: ContentTypesProps,
) => {
  const [contentTypes, setContentTypes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const updateTypes = async () => {
      setIsLoading(true)
      const token = await commitsparkConfig.createAuthenticator().getToken()
      const schemaString = await fetchSchemaString(
        token,
        props.owner,
        props.repository,
        props.gitRef,
      )
      const schema = makeExecutableSchema({
        typeDefs: schemaString,
      })

      setContentTypes(getContentTypes(schema))
      setIsLoading(false)
    }

    updateTypes()
    return () => {}
  }, [props.owner, props.repository, props.gitRef])

  const contentTypesListEntries = contentTypes.map(
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
      {isLoading && <Loading />}
      {!isLoading && <List entries={contentTypesListEntries} />}
    </>
  )
}

export default ContentTypes

function getContentTypes(schema: GraphQLSchema): string[] {
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
