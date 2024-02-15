import { GitAdapter } from '@commitspark/git-adapter'
import {
  createAdapter,
  GitHubRepositoryOptions,
} from '@commitspark/git-adapter-github'

let adapter: GitAdapter
export async function getAdapter(
  provider: string,
  token: string,
  owner: string,
  name: string,
): Promise<GitAdapter> {
  if (provider !== 'github') {
    throw new Error('Unsupported provider')
  }

  if (!adapter) {
    const gitAdapter = createAdapter()
    await gitAdapter.setRepositoryOptions({
      repositoryOwner: owner,
      repositoryName: name,
      personalAccessToken: token,
    } as GitHubRepositoryOptions)

    // const cacheAdapter = createCacheAdapter()
    // await cacheAdapter.setRepositoryOptions({
    //   childAdapter: gitAdapter,
    // })
    //
    // adapter = cacheAdapter
    adapter = gitAdapter
  }

  return adapter
}
