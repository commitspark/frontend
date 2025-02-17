import { ReactNode } from 'react'
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
import { routes } from '@/components/lib/route-generator'
import Link from 'next/link'
import StyledButton from '@/components/StyledButton'
import { Actions, Size } from '@/components/StyledButtonEnums'
import Column from '@/components/shell/Column'
import Entries from '@/components/Entries'

export default async function renderEntryList(
  owner: string,
  name: string,
  path: string[],
): Promise<ReactNode> {
  const decodedRef = decodeURIComponent(path[1])
  const typeName = path[3]

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

  const pageHeading = (
    <div className="border-b app-border-color pr-4">
      <PageHeading
        title={`Entries of type ${typeName}`}
        backLink={routes.entryTypesList(owner, name, decodedRef)}
      >
        <Link href={routes.createEntry(owner, name, decodedRef, typeName)}>
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
        owner={owner}
        repository={name}
        gitRef={decodedRef}
        typeName={typeName}
        entries={entries}
        listVisibleFieldNames={listVisibleFieldNames}
      />
    </Column>
  )
}
