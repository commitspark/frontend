import { GithubAuthenticator } from '../../../../lib/provider/github/github-authenticator'

export async function GET(request: Request) {
  const gitHubAuthenticator = new GithubAuthenticator()
  return gitHubAuthenticator.authenticate(request)
}
