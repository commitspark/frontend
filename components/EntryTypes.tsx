'use client'

import { useEffect, useState } from 'react'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { GraphQLObjectType, GraphQLSchema } from 'graphql/type'
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import Loading from './Loading'
import List from './List'
import { ListEntryProps } from './ListEntry'
import { routes } from './lib/route-generator'
import { fetchSchemaString } from '../app/server-actions/actions'
import { getCookieSession } from './lib/session'

export interface EntryTypesProps {
  owner: string
  repository: string
  gitRef: string
}

const EntryTypes: React.FC<EntryTypesProps> = (props: EntryTypesProps) => {
  const [entryTypes, setEntryTypes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const updateTypes = async (): Promise<void> => {
      setIsLoading(true)
      const session = getCookieSession()
      const schemaString = await fetchSchemaString(
        session,
        props.owner,
        props.repository,
        props.gitRef,
      )
      const schema = makeExecutableSchema({
        typeDefs: schemaString,
      })

      setEntryTypes(getEntryTypes(schema))
      setIsLoading(false)
    }

    updateTypes()
    return () => {}
  }, [props.owner, props.repository, props.gitRef])

  const contentTypesListEntries = entryTypes.map(
    (entryType: string) =>
      ({
        linkTarget: routes.entriesOfTypeList(
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

export default EntryTypes

const getEntryTypes = (schema: GraphQLSchema): string[] => {
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
