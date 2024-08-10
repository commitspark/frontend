import { Provider } from './provider/provider'
import { Authenticator } from './provider/authenticator'
import { GitAdapter } from '@commitspark/git-adapter'
import { ReactElement } from 'react'

export interface CommitsparkConfig {
  getProviderLabel: () => string
  getProviderIcon: <P>(props: P) => ReactElement<P> | null
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
