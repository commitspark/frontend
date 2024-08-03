import { CommitsparkConfig } from './lib/commitspark-config'
import { GithubProvider } from './lib/provider/github/github-provider'
import { GithubAuthenticator } from './lib/provider/github/github-authenticator'

export const commitsparkConfig: CommitsparkConfig = {
  createProvider: () => {
    return new GithubProvider()
  },
  createAuthenticator: () => {
    return new GithubAuthenticator()
  },
}
