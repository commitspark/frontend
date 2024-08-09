import { NextResponse } from 'next/server'

export interface Authenticator {
  getAuthenticationUrl(): string
  authenticate(request: Request): Promise<NextResponse>
  getToken(): Promise<string>
  removeAuthentication(): Promise<void>
}
