import { createAuthenticator } from '@/commitspark.authenticator'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest): Promise<NextResponse> {
  return createAuthenticator().authenticate(request)
}
