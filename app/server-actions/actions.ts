'use server'

import { commitsparkConfig } from '../../commitspark.config'
import { Repository, User } from '../../lib/provider/provider'
import { getApiService } from '@commitspark/graphql-api'
import { getAdapter } from '../../components/lib/getAdapter'
import {
  assertIsArrayOfRecordsOrNull,
  assertIsString,
  assertIsRecordOrNull,
} from '../../components/lib/assert'

interface GraphQLQuery {
  query: string
  variables?: Record<string, any>
}

export async function fetchBranches(
  token: string,
  owner: string,
  repository: string,
) {
  const provider = commitsparkConfig.createProvider()
  return await provider.getBranches(token, {
    owner: owner,
    name: repository,
  })
}

export async function fetchRepositories(token: string): Promise<Repository[]> {
  const provider = commitsparkConfig.createProvider()
  return await provider.getRepositories(token)
}

export async function fetchUserInfo(token: string): Promise<User> {
  const provider = commitsparkConfig.createProvider()
  return await provider.getUser(token)
}

export async function fetchTypeNameById(
  token: string,
  owner: string,
  name: string,
  ref: string,
  entryId: string,
): Promise<string> {
  const apiService = await getApiService()
  const adapter = await getAdapter(token, owner, name)
  const response = await apiService.postGraphQL(adapter, ref, {
    query: `query { data: _typeName(id:"${entryId}") }`,
  })
  assertIsString(response.data?.data)
  return response.data?.data
}

export async function fetchSchemaString(
  token: string,
  owner: string,
  name: string,
  ref: string,
): Promise<string> {
  const apiService = await getApiService()
  const adapter = await getAdapter(token, owner, name)

  const response = await apiService.getSchema(adapter, ref)
  return response.data
}

export async function fetchContent(
  token: string,
  owner: string,
  name: string,
  ref: string,
  query: GraphQLQuery,
): Promise<Record<string, any>> {
  const apiService = await getApiService()
  const adapter = await getAdapter(token, owner, name)

  const response = await apiService.postGraphQL(adapter, ref, query)

  if (
    response.errors &&
    Array.isArray(response.errors) &&
    response.errors.length > 0
  ) {
    const message = response.errors.map((error) => error.message).join('\n')
    throw new Error(message)
  }

  return JSON.parse(JSON.stringify(response.data))
}

export async function fetchAllByType(
  token: string,
  owner: string,
  name: string,
  ref: string,
  typeName: string,
  additionalFields?: string[],
): Promise<Record<string, any>[]> {
  const apiService = await getApiService()
  const adapter = await getAdapter(token, owner, name)
  const response = await apiService.postGraphQL(adapter, ref, {
    query: `query { data: all${typeName}s {
    id
    ${additionalFields?.join('\n') ?? ''}
    } }`,
  })

  assertIsArrayOfRecordsOrNull(response.data?.data)

  return JSON.parse(JSON.stringify(response.data?.data)) ?? []
}

export async function mutateContent(
  token: string,
  owner: string,
  repository: string,
  ref: string,
  mutation: { query: string; variables?: Record<string, unknown> | undefined },
): Promise<Record<string, unknown> | null> {
  const adapter = await getAdapter(token, owner, repository)
  const apiService = await getApiService()
  const response = await apiService.postGraphQL<Record<string, unknown>>(
    adapter,
    ref,
    mutation,
  )

  if (response.errors) {
    throw new Error(
      `GraphQL call failed with error "${JSON.stringify(response.errors)}"`,
    )
  }

  assertIsRecordOrNull(response.data)

  return JSON.parse(JSON.stringify(response.data))
}
