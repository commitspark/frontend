import { NextRequest, NextResponse } from 'next/server'
import { commitsparkConfig } from './commitspark.config'

export default async function middleware(
  req: NextRequest,
): Promise<NextResponse> {
  const path = req.nextUrl.pathname
  const publicRoutes = /^\/(sign-in\/).*$/

  if (
    !publicRoutes.exec(path) &&
    !(await commitsparkConfig.createAuthenticator().isAuthenticated(req))
  ) {
    return NextResponse.redirect(new URL('/sign-in/', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/|.*\\.png$).*)'],
}
