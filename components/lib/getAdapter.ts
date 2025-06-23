'use server'

import { GitAdapter } from '@commitspark/git-adapter'
import { commitsparkConfig } from '@commitspark-config'
import { hasher } from 'node-object-hash'

const adapters: Record<string, GitAdapter> = {}
const hasherInstance = hasher({ coerce: false, sort: false, trim: false })

export async function getAdapter(
  token: string,
  owner: string,
  name: string,
): Promise<GitAdapter> {
  const adapterHash = hasherInstance.hash({ token, owner, name })
  if (!(adapterHash in adapters)) {
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
    adapters[adapterHash] = gitAdapter
  }

  return adapters[adapterHash]
}
