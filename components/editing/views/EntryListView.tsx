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
import Link from 'next/link'
import StyledButton from '@/components/StyledButton'
import { Actions, Size } from '@/components/StyledButtonEnums'
import Column from '@/components/shell/Column'
import Entries from '@/components/editing/Entries'
import { editingActivity } from '@/components/editing/editingActivity'
import { RouteIdCreateEntry } from '@/components/editing/types'
import BranchesSelector from '@/components/BranchesSelector'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import EntryTypesSelector from '@/components/EntryTypesSelector'

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

  const pageHeading = (
    <div className="flex flex-row gap-x-2">
      <BranchesSelector repositoryInfo={repositoryInfo} />
      <ChevronRightIcon className="icon-size self-center" />
      <EntryTypesSelector
        repositoryInfo={repositoryInfo}
        currentTypeName={typeName}
      />
      <ChevronRightIcon className="icon-size self-center" />
      <Link
        href={editingActivity.routeGenerator(RouteIdCreateEntry, [
          props.owner,
          props.name,
          decodedRef,
          typeName,
        ])}
      >
        <StyledButton actionType={Actions.positive} size={Size.md}>
          Create new
        </StyledButton>
      </Link>
    </div>
  )

  return (
    <div className="flex-grow mx-auto max-w-6xl">
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
    </div>
  )
}

export default EntryListView
