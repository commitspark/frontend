import React from 'react'
import Entries from '../../../../../../../../components/Entries'
import PageHeading from '../../../../../../../../components/PageHeading'
import StyledButton from '../../../../../../../../components/StyledButton'
import Column from '../../../../../../../../components/shell/Column'
import {
  Actions,
  Size,
} from '../../../../../../../../components/StyledButtonEnums'
import { routes } from '../../../../../../../../components/lib/route-generator'
import Link from 'next/link'
import { getCookieSession } from '../../../../../../../../components/lib/session'
import {
  fetchAllByType,
  fetchSchemaString,
} from '../../../../../../../../components/lib/git-functions'
import { RepositoryRefInfo } from '../../../../../../../../components/context/EditorProvider'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { isObjectType } from 'graphql/type'
import {
  getDirectiveByName,
  getListVisibleFieldNames,
} from '../../../../../../../../components/lib/schema-utils'
import { notFound } from 'next/navigation'

interface EntryTypeEntriesPageParams {
  owner: string
  name: string
  ref: string
  typeName: string
}

export const dynamic = 'force-dynamic'

export default async function EntryTypeEntriesPage({
  params,
}: {
  params: EntryTypeEntriesPageParams
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
  if (!schemaString) {
    throw new Error('Failed to retrieve GraphQL schema')
  }
  const schema = makeExecutableSchema({
    typeDefs: schemaString,
  })
  const type = schema.getType(params.typeName)
  if (!isObjectType(type) || !getDirectiveByName(type, 'Entry')) {
    notFound()
  }
  const listVisibleFieldNames = getListVisibleFieldNames(type)
  const entries = await fetchAllByType(
    session,
    repositoryInfo.owner,
    repositoryInfo.repository,
    repositoryInfo.gitRef,
    params.typeName,
    listVisibleFieldNames,
  )

  const pageHeading = (
    <div className="border-b app-border-color pr-4">
      <PageHeading
        title={`Entries of type ${params.typeName}`}
        backLink={routes.entryTypesList(params.owner, params.name, decodedRef)}
      >
        <Link
          href={routes.createEntry(
            params.owner,
            params.name,
            decodedRef,
            params.typeName,
          )}
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
        owner={params.owner}
        repository={params.name}
        gitRef={decodedRef}
        typeName={params.typeName}
        entries={entries}
        listVisibleFieldNames={listVisibleFieldNames}
      />
    </Column>
  )
}
