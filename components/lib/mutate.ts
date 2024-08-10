import { getAdapter } from './getAdapter'
import { getApiService } from '@commitspark/graphql-api'
import { assertIsRecordOrNull } from './assert'

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

  assertIsRecordOrNull(response.data?.data)

  return response.data.data
}
