import { CommitsparkConfig } from '@/lib/types'
import { GitHubProvider } from './lib/provider/github/github-provider'
import {
  createAdapter,
  GitHubRepositoryOptions,
} from '@commitspark/git-adapter-github'
import { GitAdapter } from '@commitspark/git-adapter'
import GitHubIcon, { GitHubIconProps } from './lib/provider/github/GitHubIcon'
import { editingActivity } from '@/components/editing/editingActivity'
import { buildConfig } from '@/lib/commitspark-config'

export const commitsparkConfig: CommitsparkConfig = buildConfig({
  getProviderLabel: () => 'GitHub',
  getProviderIcon: <P extends GitHubIconProps>(props: P) => GitHubIcon(props),
  createProvider: () => {
    return new GitHubProvider()
  },
  createGitAdapter: async (repositoryOptions): Promise<GitAdapter> => {
    const adapter = createAdapter()
    await adapter.setRepositoryOptions({
      ...repositoryOptions,
    } as GitHubRepositoryOptions)
    return adapter
  },
  activities: [editingActivity],
})
