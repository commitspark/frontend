import { GitAdapter } from '@commitspark/git-adapter'
import { commitsparkConfig } from '../../commitspark.config'

let adapter: GitAdapter
export async function getAdapter(
  provider: string,
  token: string,
  owner: string,
  name: string,
): Promise<GitAdapter> {
  if (provider !== commitsparkConfig.getProviderId()) {
    throw new Error(`Unsupported provider "${provider}"`)
  }

  if (!adapter) {
    const gitAdapter = await commitsparkConfig.createGitAdapter({
      repositoryOwner: owner,
      repositoryName: name,
      accessToken: token,
    })

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
