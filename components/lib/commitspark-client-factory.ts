'use server'

import { commitsparkConfig } from '@commitspark-config'
import { hasher } from 'node-object-hash'
import {
  Client,
  createClient as apiCreateClient,
} from '@commitspark/graphql-api'

const clients: Record<string, Client> = {}
const hasherInstance = hasher({ coerce: false, sort: false, trim: false })

export async function createClient(
  token: string,
  owner: string,
  name: string,
): Promise<Client> {
  const parametersHash = hasherInstance.hash({ token, owner, name })
  if (!(parametersHash in clients)) {
    const adapter = await commitsparkConfig.createGitAdapter({
      repositoryOwner: owner,
      repositoryName: name,
      accessToken: token,
    })
    const client = await apiCreateClient(adapter)

    // const cacheAdapter = createCacheAdapter()
    // await cacheAdapter.setRepositoryOptions({
    //   childAdapter: gitAdapter,
    // })
    //
    // adapter = cacheAdapter
    clients[parametersHash] = client
  }

  return clients[parametersHash]
}
