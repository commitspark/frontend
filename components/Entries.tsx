'use client'

import { useEffect, useState } from 'react'
import {
  fetchAllByType,
  fetchSchemaString,
} from '../app/server-actions/actions'
import List from './List'
import Loading from './Loading'
import { ListEntryProps } from './ListEntry'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { getListVisibleFieldNames } from './lib/schema-utils'
import { routes } from './lib/route-generator'
import { isObjectType } from 'graphql/type'
import { getCookieSession } from './lib/session'

export interface EntriesOverviewProps {
  owner: string
  repository: string
  gitRef: string
  typeName: string
}

export default function Entries(props: EntriesOverviewProps) {
  const [entries, setEntries] = useState<Record<string, any>[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [visibleFieldNames, setVisibleFieldNames] = useState<string[]>()

  useEffect(() => {
    const updateEntries = async () => {
      setIsLoading(true)
      const session = getCookieSession()
      const schemaString = await fetchSchemaString(
        session,
        props.owner,
        props.repository,
        props.gitRef,
      )
      if (!schemaString) {
        throw new Error('Failed to retrieve GraphQL schema')
      }
      const schema = makeExecutableSchema({
        typeDefs: schemaString,
      })
      const type = schema.getType(props.typeName)
      if (!isObjectType(type)) {
        throw new Error(
          `Expected GraphQLObjectType for type "${props.typeName}"`,
        )
      }
      const listVisibleFieldNames = getListVisibleFieldNames(type)
      const entries = await fetchAllByType(
        session,
        props.owner,
        props.repository,
        props.gitRef,
        props.typeName,
        listVisibleFieldNames,
      )
      setEntries(entries)
      setVisibleFieldNames(listVisibleFieldNames)
      setIsLoading(false)
    }

    updateEntries()

    return () => {}
  }, [props.owner, props.repository, props.gitRef, props.typeName])

  const entryListEntries = entries.map((entry: any) => {
    let labelData: Record<string, any> = {}
    if (visibleFieldNames && visibleFieldNames.length > 0) {
      for (const fieldName of visibleFieldNames) {
        labelData[fieldName] = entry[fieldName]
      }
    } else {
      labelData['id'] = entry.id
    }
    return {
      linkTarget: routes.editEntry(
        props.owner,
        props.repository,
        props.gitRef,
        entry.id,
      ),
      linkContent: labelData,
    } as ListEntryProps
  })

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && <List entries={entryListEntries} />}
    </>
  )
}
