import { NextRequest, NextResponse } from 'next/server'

export interface Authenticator {
  getAuthenticationUrl(): string
  authenticate(request: NextRequest): Promise<NextResponse>
  isAuthenticated(request: NextRequest): Promise<boolean>
  removeAuthentication(): Promise<void>
}

export const COOKIE_SESSION_NAME = 'session'
export const COOKIE_SESSION_EXPIRY_DURATION = 7 * 24 * 3600
