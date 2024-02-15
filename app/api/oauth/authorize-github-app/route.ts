import { NextResponse } from 'next/server'
import { COOKIE_PROVIDER_TOKEN_GITHUB } from '../../../../lib/cookies'

export async function GET(request: Request) {
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
      response.cookies.set(COOKIE_PROVIDER_TOKEN_GITHUB, accessToken, {
        path: '/',
        maxAge: 3600 * 24 * 30,
        secure: true,
      })
      return response
    })
    .catch((error) => {
      return new NextResponse(null, {
        status: 400,
      })
    })
}
