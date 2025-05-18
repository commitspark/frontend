import { NextRequest, NextResponse } from 'next/server'
import { createAuthenticator } from '@/commitspark.authenticator'

export default async function middleware(
  req: NextRequest,
): Promise<NextResponse> {
  const path = req.nextUrl.pathname
  const publicRoutes = /^\/(sign-in\/).*$/

  if (
    !publicRoutes.exec(path) &&
    !(await createAuthenticator().isAuthenticated(req))
  ) {
    return NextResponse.redirect(new URL('/sign-in/', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/|.*\\.png$).*)'],
}
