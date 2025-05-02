import React, { use } from 'react'
import { RepositoryRefInfo } from '@/components/context/EditorProvider'
import { getCookieSession } from '@/components/lib/session'
import {
  fetchAllByType,
  fetchSchemaString,
} from '@/components/lib/git-functions'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { isObjectType } from 'graphql/type'
import {
  getDirectiveByName,
  getListVisibleFieldNames,
} from '@/components/lib/schema-utils'
import { notFound } from 'next/navigation'
import PageHeading from '@/components/PageHeading'
import Link from 'next/link'
import StyledButton from '@/components/StyledButton'
import { Actions, Size } from '@/components/StyledButtonEnums'
import Column from '@/components/shell/Column'
import Entries from '@/components/editing/Entries'
import { commitsparkConfig } from '@commitspark-config'
import {
  EditingActivityId,
  RouteIdCreateEntry,
  RouteIdEntryTypesList,
} from '@/components/editing/types'

interface EntryListViewProps {
  owner: string
  name: string
  path: string[]
}

const EntryListView: React.FC<EntryListViewProps> = (
  props: EntryListViewProps,
) => {
  const decodedRef = decodeURIComponent(props.path[1])
  const typeName = props.path[3]

  const repositoryInfo: RepositoryRefInfo = {
    owner: props.owner,
    repository: props.name,
    gitRef: decodedRef,
  }

  const getData = async () => {
    const session = await getCookieSession()
    const schemaString = await fetchSchemaString(
      session,
      repositoryInfo.owner,
      repositoryInfo.repository,
      repositoryInfo.gitRef,
    )
    if (!schemaString) {
      throw new Error('Failed to retrieve GraphQL schema')
    }
    const schema = makeExecutableSchema({
      typeDefs: schemaString,
    })
    const type = schema.getType(typeName)
    if (!isObjectType(type) || !getDirectiveByName(type, 'Entry')) {
      notFound()
    }
    const listVisibleFieldNames = getListVisibleFieldNames(type)
    const entries = await fetchAllByType(
      session,
      repositoryInfo.owner,
      repositoryInfo.repository,
      repositoryInfo.gitRef,
      typeName,
      listVisibleFieldNames,
    )

    return {
      entries,
      listVisibleFieldNames,
    }
  }

  const data = use(getData())

  const editingActivity = commitsparkConfig.activities.find(
    (activity) => activity.id === EditingActivityId,
  )
  if (!editingActivity) {
    throw new Error('Cannot find editing activity')
  }

  const pageHeading = (
    <div className="border-b app-border-color pr-4">
      <PageHeading
        title={`Entries of type ${typeName}`}
        backLink={editingActivity.routeGenerator(RouteIdEntryTypesList, [
          props.owner,
          props.name,
          decodedRef,
        ])}
      >
        <Link
          href={editingActivity.routeGenerator(RouteIdCreateEntry, [
            props.owner,
            props.name,
            decodedRef,
            typeName,
          ])}
        >
          <StyledButton actionType={Actions.positive} size={Size.lg}>
            Create new
          </StyledButton>
        </Link>
      </PageHeading>
    </div>
  )

  return (
    <Column pageHeading={pageHeading}>
      <Entries
        owner={props.owner}
        repository={props.name}
        gitRef={decodedRef}
        typeName={typeName}
        entries={data.entries}
        listVisibleFieldNames={data.listVisibleFieldNames}
      />
    </Column>
  )
}

export default EntryListView
