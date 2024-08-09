import { Authenticator } from '../authenticator'
import { NextResponse } from 'next/server'
import { deleteCookie, getCookie } from 'cookies-next'

export class GithubAuthenticator implements Authenticator {
  private static COOKIE_NAME_TOKEN = 'provider_token_github'

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

  async authenticate(request: Request): Promise<NextResponse> {
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
    return await fetch(endpoint, {
      method: 'POST',
      body: data,
    })
      .then((response) => response.text())
      .then((paramsString) => {
        let params = new URLSearchParams(paramsString)
        // see https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app#using-the-web-application-flow-to-generate-a-user-access-token
        // step 4 for all values returned by GitHub
        const accessToken = params.get('access_token')

        if (!accessToken) {
          return new NextResponse(null, {
            status: 400,
          })
        }

        const response = NextResponse.redirect(
          new URL(`/p/github`, hostingUrl),
          307,
        )
        response.cookies.set(
          GithubAuthenticator.COOKIE_NAME_TOKEN,
          accessToken,
          {
            path: '/',
            maxAge: 3600 * 24 * 30,
            secure: true,
          },
        )
        return response
      })
      .catch((error) => {
        return new NextResponse(null, {
          status: 400,
        })
      })
  }

  getToken(): Promise<string> {
    return new Promise((resolve) =>
      resolve(`${getCookie(GithubAuthenticator.COOKIE_NAME_TOKEN)}`),
    )
  }

  removeAuthentication(): Promise<void> {
    deleteCookie(GithubAuthenticator.COOKIE_NAME_TOKEN)
    return new Promise((resolve) => resolve())
  }
}
