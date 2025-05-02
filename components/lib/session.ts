'use server'

import 'server-only'
import { cookies } from 'next/headers'
import { COOKIE_SESSION_NAME } from '@/lib/provider/authenticator'
import { createAuthenticator } from '@/commitspark.authenticator'
import { EncryptJWT, jwtDecrypt, JWTPayload } from 'jose'

export interface SessionPayload {
  accessToken: string
}

const encryptionKey = Buffer.from(
  process.env.JWT_ENCRYPTION_KEY ?? '',
  'base64',
)

export async function createSessionJwt(
  sessionPayload: SessionPayload,
  expiryDuration: number,
): Promise<string> {
  const payload: SessionPayload & JWTPayload = {
    ...sessionPayload,
  }

  return await new EncryptJWT(payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
    .setIssuedAt()
    .setExpirationTime(`${expiryDuration}s`)
    .encrypt(encryptionKey)
}

export async function readSessionJwt(jwt: string): Promise<SessionPayload> {
  const { payload } = await jwtDecrypt<SessionPayload>(jwt, encryptionKey)
  return payload
}

export async function getCookieSession(): Promise<string> {
  const cookie = (await cookies()).get(COOKIE_SESSION_NAME)
  return `${cookie?.value}`
}

export async function removeAuthentication(): Promise<void> {
  ;(await cookies()).delete(COOKIE_SESSION_NAME)
  await createAuthenticator().removeAuthentication()
}
