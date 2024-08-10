import { getApiService } from '@commitspark/graphql-api'
import { getAdapter } from './getAdapter'
import { assertIsArrayOfRecordsOrNull, assertIsString } from './assert'

interface GraphQLQuery {
  query: string
  variables?: Record<string, any>
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

export async function fetchSchema(
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

  return apiService.postGraphQL(adapter, ref, query)
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

  return response.data?.data ?? []
}
