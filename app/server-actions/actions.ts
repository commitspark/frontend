'use server'

import 'server-only'
import { commitsparkConfig } from '../../commitspark.config'
import { Repository, User } from '../../lib/provider/provider'
import { getApiService } from '@commitspark/graphql-api'
import { getAdapter } from '../../components/lib/getAdapter'
import {
  assertIsArrayOfRecordsOrNull,
  assertIsString,
  assertIsRecordOrNull,
} from '../../components/lib/assert'
import { decryptSession } from './session'

interface GraphQLQuery {
  query: string
  variables?: Record<string, any>
}

export async function fetchBranches(
  sessionCookie: string,
  owner: string,
  repository: string,
) {
  const { accessToken } = await decryptSession(sessionCookie)
  const provider = commitsparkConfig.createProvider()
  return await provider.getBranches(accessToken, {
    owner: owner,
    name: repository,
  })
}

export async function fetchRepositories(
  sessionCookie: string,
): Promise<Repository[]> {
  const { accessToken } = await decryptSession(sessionCookie)
  const provider = commitsparkConfig.createProvider()
  return await provider.getRepositories(accessToken)
}

export async function fetchUserInfo(sessionCookie: string): Promise<User> {
  const { accessToken } = await decryptSession(sessionCookie)
  const provider = commitsparkConfig.createProvider()
  return await provider.getUser(accessToken)
}

export async function fetchTypeNameById(
  sessionCookie: string,
  owner: string,
  name: string,
  ref: string,
  entryId: string,
): Promise<string> {
  const { accessToken } = await decryptSession(sessionCookie)
  const apiService = await getApiService()
  const adapter = await getAdapter(accessToken, owner, name)
  const response = await apiService.postGraphQL(adapter, ref, {
    query: `query { data: _typeName(id:"${entryId}") }`,
  })
  assertIsString(response.data?.data)
  return response.data?.data
}

export async function fetchSchemaString(
  sessionCookie: string,
  owner: string,
  name: string,
  ref: string,
): Promise<string> {
  const { accessToken } = await decryptSession(sessionCookie)
  const apiService = await getApiService()
  const adapter = await getAdapter(accessToken, owner, name)

  const response = await apiService.getSchema(adapter, ref)
  return response.data
}

export async function fetchContent(
  sessionCookie: string,
  owner: string,
  name: string,
  ref: string,
  query: GraphQLQuery,
): Promise<Record<string, any>> {
  const { accessToken } = await decryptSession(sessionCookie)
  const apiService = await getApiService()
  const adapter = await getAdapter(accessToken, owner, name)

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
  sessionCookie: string,
  owner: string,
  name: string,
  ref: string,
  typeName: string,
  additionalFields?: string[],
): Promise<Record<string, any>[]> {
  const { accessToken } = await decryptSession(sessionCookie)
  const apiService = await getApiService()
  const adapter = await getAdapter(accessToken, owner, name)
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
  sessionCookie: string,
  owner: string,
  repository: string,
  ref: string,
  mutation: { query: string; variables?: Record<string, unknown> | undefined },
): Promise<Record<string, unknown> | null> {
  const { accessToken } = await decryptSession(sessionCookie)
  const adapter = await getAdapter(accessToken, owner, repository)
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
