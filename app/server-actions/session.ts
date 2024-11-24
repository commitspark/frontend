'use server'

import 'server-only'
import { JWTPayload, jwtVerify, SignJWT } from 'jose'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)
const algorithm = 'HS256'

export interface SessionPayload extends JWTPayload {
  accessToken: string
}

export async function encryptSession(
  payload: SessionPayload,
  expiryDuration: number,
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime(`${expiryDuration}s`)
    .sign(encodedKey)
}

export async function decryptSession(
  session: string | undefined = '',
): Promise<SessionPayload> {
  const { payload } = await jwtVerify<SessionPayload>(session, encodedKey, {
    algorithms: [algorithm],
  })
  return payload
}
