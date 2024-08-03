import { NextResponse } from 'next/server'

export interface Authenticator {
  getAuthenticationUrl(): string
  authenticate(request: Request): Promise<NextResponse>
}
