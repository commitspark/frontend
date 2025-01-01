'use server'

import 'server-only'
import { commitsparkConfig } from '../../commitspark.config'
import { User } from '../../lib/provider/provider'
import { readSessionJwt } from '../../components/lib/session'
import { fetchAllByType } from '../../components/lib/git-functions'
import { getAdapter } from '../../components/lib/getAdapter'
import { getApiService } from '@commitspark/graphql-api'
import { assertIsRecordOrNull } from '../../components/lib/assert'
import { revalidatePath } from 'next/cache'

export async function actionFetchUserInfo(
  sessionCookie: string,
): Promise<User> {
  const { accessToken } = await readSessionJwt(sessionCookie)
  const provider = commitsparkConfig.createProvider()
  return await provider.getUser(accessToken)
}

export async function actionFetchAllByType(
  sessionCookie: string,
  owner: string,
  name: string,
  ref: string,
  typeName: string,
  additionalFields?: string[],
): Promise<Record<string, any>[]> {
  // TODO handle notFound exceptions
  return fetchAllByType(
    sessionCookie,
    owner,
    name,
    ref,
    typeName,
    additionalFields,
  )
}

export async function actionMutateEntry(
  sessionCookie: string,
  owner: string,
  repository: string,
  ref: string,
  mutation: { query: string; variables?: Record<string, unknown> | undefined },
): Promise<Record<string, unknown> | null> {
  const { accessToken } = await readSessionJwt(sessionCookie)
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

export async function actionRevalidatePath(path: string): Promise<void> {
  revalidatePath(path)
}
