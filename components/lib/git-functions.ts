import { readSessionJwt } from './session'
import { commitsparkConfig } from '../../commitspark.config'
import { Repository } from '../../lib/provider/provider'
import { getApiService } from '@commitspark/graphql-api'
import { getAdapter } from './getAdapter'
import { assertIsArrayOfRecordsOrNull, assertIsString } from './assert'

interface GraphQLQuery {
  query: string
  variables?: Record<string, any>
}

export async function fetchBranches(
  sessionCookie: string,
  owner: string,
  repository: string,
) {
  const { accessToken } = await readSessionJwt(sessionCookie)
  const provider = commitsparkConfig.createProvider()
  return await provider.getBranches(accessToken, {
    owner: owner,
    name: repository,
  })
}

export async function fetchRepositories(
  sessionCookie: string,
): Promise<Repository[]> {
  const { accessToken } = await readSessionJwt(sessionCookie)
  const provider = commitsparkConfig.createProvider()
  return await provider.getRepositories(accessToken)
}

export async function fetchTypeNameById(
  sessionCookie: string,
  owner: string,
  name: string,
  ref: string,
  entryId: string,
): Promise<string> {
  const { accessToken } = await readSessionJwt(sessionCookie)
  const apiService = await getApiService()
  const adapter = await getAdapter(accessToken, owner, name)
  const response = await apiService.postGraphQL(adapter, ref, {
    query: `query { data: _typeName(id:"${entryId}") }`,
  })
  if (
    response.errors &&
    Array.isArray(response.errors) &&
    response.errors.length > 0
  ) {
    const message = response.errors.map((error) => error.message).join('\n')
    throw new Error(message)
  }
  assertIsString(response.data?.data)
  return response.data?.data
}

export async function fetchSchemaString(
  sessionCookie: string,
  owner: string,
  name: string,
  ref: string,
): Promise<string> {
  const { accessToken } = await readSessionJwt(sessionCookie)
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
  const { accessToken } = await readSessionJwt(sessionCookie)
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
  const { accessToken } = await readSessionJwt(sessionCookie)
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
