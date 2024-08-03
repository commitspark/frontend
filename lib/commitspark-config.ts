import { Provider } from './provider/provider'
import { Authenticator } from './provider/authenticator'
import { GitAdapter } from '@commitspark/git-adapter'

export interface CommitsparkConfig {
  getProviderName: () => string
  createProvider: () => Provider
  createAuthenticator: () => Authenticator
  createGitAdapter: (
    repositoryOptions: RepositoryOptions,
  ) => Promise<GitAdapter>
}

export interface RepositoryOptions {
  repositoryOwner: string
  repositoryName: string
  accessToken: string
}
