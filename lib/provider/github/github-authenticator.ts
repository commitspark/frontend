import {
  Authenticator,
  COOKIE_SESSION_EXPIRY_DURATION,
  COOKIE_SESSION_NAME,
} from '../authenticator'
import { NextRequest, NextResponse } from 'next/server'
import { routes } from '../../../components/lib/route-generator'
import {
  readSessionJwt,
  createSessionJwt,
} from '../../../components/lib/session'

export class GitHubAuthenticator implements Authenticator {
  getAuthenticationUrl(): string {
    const authorizeParams = new URLSearchParams({
      scope: ['repo'].join(','),
      client_id: process.env.GITHUB_OAUTH_CLIENT_ID ?? '',
      redirect_uri: `${process.env.HOSTING_URL}/api/oauth/authenticate-with-provider/`,
      state: new URLSearchParams({
        // optional additional parameters
      }).toString(),
    })

    return `https://github.com/login/oauth/authorize?${authorizeParams.toString()}`
  }

  async authenticate(request: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(request.url)

    const code = searchParams.get('code')
    if (!code) {
      return new NextResponse(null, {
        status: 400,
      })
    }

    const hostingUrl = process.env.HOSTING_URL
    if (!hostingUrl) {
      return new NextResponse('HOSTING_URL environment variable not set', {
        status: 400,
      })
    }

    // see https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app#using-the-web-application-flow-to-generate-a-user-access-token
    // step 3 for all values supported by GitHub
    const data = new URLSearchParams()
    data.append('client_id', process.env.GITHUB_OAUTH_CLIENT_ID ?? '')
    data.append('client_secret', process.env.GITHUB_OAUTH_CLIENT_SECRET ?? '')
    data.append('code', code)

    const endpoint = 'https://github.com/login/oauth/access_token'
    let remoteResponse
    try {
      remoteResponse = await fetch(endpoint, {
        method: 'POST',
        body: data,
      })
    } catch (error) {
      return new NextResponse(null, {
        status: 400,
      })
    }

    const paramsString = await remoteResponse.text()

    let params = new URLSearchParams(paramsString)
    // see https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app#using-the-web-application-flow-to-generate-a-user-access-token
    // step 4 for all values returned by GitHub
    const accessToken = params.get('access_token')

    if (!accessToken) {
      return new NextResponse(null, {
        status: 400,
      })
    }

    const expiresAt = new Date(
      Date.now() + COOKIE_SESSION_EXPIRY_DURATION * 1000,
    )
    const sessionJwt = await createSessionJwt(
      { accessToken },
      COOKIE_SESSION_EXPIRY_DURATION,
    )

    const response = NextResponse.redirect(
      new URL(routes.repositoryList(), hostingUrl),
      307,
    )
    response.cookies.set(COOKIE_SESSION_NAME, sessionJwt, {
      secure: true,
      path: '/',
      expires: expiresAt,
    })

    return response
  }

  async isAuthenticated(request: NextRequest): Promise<boolean> {
    const cookieValue = request.cookies.get(COOKIE_SESSION_NAME)?.value
    let isAuthenticated = false
    if (cookieValue) {
      try {
        await readSessionJwt(cookieValue)
        isAuthenticated = true
      } catch (error) {}
    }

    return new Promise<boolean>((resolve) => resolve(isAuthenticated))
  }

  async removeAuthentication(): Promise<void> {
    return new Promise((resolve) => resolve())
  }
}
