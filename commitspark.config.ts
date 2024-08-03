import { CommitsparkConfig } from './lib/commitspark-config'
import { GithubProvider } from './lib/provider/github/github-provider'
import { GithubAuthenticator } from './lib/provider/github/github-authenticator'
import {
  createAdapter,
  GitHubRepositoryOptions,
} from '@commitspark/git-adapter-github'
import { GitAdapter } from '@commitspark/git-adapter'

export const commitsparkConfig: CommitsparkConfig = {
  getProviderName: () => 'github',
  createProvider: () => {
    return new GithubProvider()
  },
  createAuthenticator: () => {
    return new GithubAuthenticator()
  },
  createGitAdapter: async (repositoryOptions): Promise<GitAdapter> => {
    const adapter = createAdapter()
    await adapter.setRepositoryOptions({
      repositoryOwner: repositoryOptions.repositoryOwner,
      repositoryName: repositoryOptions.repositoryName,
      personalAccessToken: repositoryOptions.accessToken,
    } as GitHubRepositoryOptions)
    return adapter
  },
}
