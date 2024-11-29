'use server'

import 'server-only'
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
