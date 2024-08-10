import { NextRequest, NextResponse } from 'next/server'

export interface Authenticator {
  getAuthenticationUrl(): string
  authenticate(request: NextRequest): Promise<NextResponse>
  isAuthenticated(request: NextRequest): Promise<boolean>
  getToken(): Promise<string>
  removeAuthentication(): Promise<void>
}
