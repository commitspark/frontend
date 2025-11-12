'use server'

import 'server-only'
import { commitsparkConfig } from '@commitspark-config'
import { User } from '@/lib/provider/provider'
import { readSessionJwt } from '@/components/lib/session'
import { revalidatePath } from 'next/cache'

export async function actionFetchUserInfo(
  sessionCookie: string,
): Promise<User> {
  const { accessToken } = await readSessionJwt(sessionCookie)
  const provider = commitsparkConfig.createProvider()
  return await provider.getUser(accessToken)
}

export async function actionRevalidatePath(path: string): Promise<void> {
  revalidatePath(path)
}
