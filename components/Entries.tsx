'use client'

import { getCookie } from 'cookies-next'
import { COOKIE_PROVIDER_TOKEN_GITHUB } from '../lib/cookies'
import { useEffect, useState } from 'react'
import { fetchAllByType, fetchSchema } from './lib/fetch'
import List from './List'
import Loading from './Loading'
import { ListEntryProps } from './ListEntry'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { getListVisibleFieldNames } from './lib/schema-utils'
import { routes } from './lib/route-generator'
import { isObjectType } from 'graphql/type'

export interface EntriesOverviewProps {
  provider: string
  owner: string
  repository: string
  gitRef: string
  typeName: string
}

export default function Entries(props: EntriesOverviewProps) {
  const token = `${getCookie(COOKIE_PROVIDER_TOKEN_GITHUB)}`
  const [entries, setEntries] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [visibleFieldNames, setVisibleFieldNames] = useState<string[]>()

  useEffect(() => {
    async function fetchEntries() {
      setEntries([])
      const schemaString = await fetchSchema(
        props.provider,
        token,
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
        props.provider,
        token,
        props.owner,
        props.repository,
        props.gitRef,
        props.typeName,
        listVisibleFieldNames,
      )
      if (!ignore) {
        setEntries(entries)
        setVisibleFieldNames(listVisibleFieldNames)
        setLoading(false)
      }
    }

    let ignore = false
    fetchEntries()
    return () => {
      ignore = true
    }
  }, [token])

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
      linkTarget: routes.editContentEntry(
        props.provider,
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
      {loading && <Loading />}
      {!loading && <List entries={entryListEntries} />}
    </>
  )
}
