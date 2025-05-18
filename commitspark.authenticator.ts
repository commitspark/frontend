import { GitHubAuthenticator } from '@/lib/provider/github/github-authenticator'
import { Authenticator } from '@/lib/provider/authenticator'

export function createAuthenticator(): Authenticator {
  return new GitHubAuthenticator()
}

export function authenticationSuccessRoute(): string {
  return '/'
}
