import { Branch, Provider, Repository, User } from '../provider'
import { Octokit } from 'octokit'

export class GitHubProvider implements Provider {
  async getBranches(
    authToken: string,
    repository: Repository,
  ): Promise<Branch[]> {
    const octokit = new Octokit({ auth: authToken })
    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/branches',
      {
        owner: repository.owner,
        repo: repository.name,
        request: {
          // don't use cache for now to make sure branches are always up to date; see https://github.com/octokit/octokit.js/issues/890
          cache: 'reload',
        },
      },
    )
    return response.data
  }

  async createBranch(
    authToken: string,
    repository: Repository,
    sourceRef: string,
    branchName: string,
  ): Promise<Branch> {
    const octokit = new Octokit({ auth: authToken })

    // get the latest commit of existing branch
    const refResponse = await octokit.request(
      'GET /repos/{owner}/{repo}/git/ref/{ref}',
      {
        owner: repository.owner,
        repo: repository.name,
        ref: `heads/${sourceRef}`,
      },
    )

    const response = await octokit.request(
      'POST /repos/{owner}/{repo}/git/refs',
      {
        owner: repository.owner,
        repo: repository.name,
        sha: refResponse.data.object.sha,
        ref: `refs/heads/${branchName}`,
      },
    )

    return {
      name: branchName,
      commit: response.data.object,
      protected: false, // TODO not necessarily the case
    }
  }

  async getRepositories(authToken: string): Promise<Repository[]> {
    const octokit = new Octokit({ auth: authToken })
    // TODO this must be refactored to support pagination
    const response = await octokit.request('GET /user/repos', { per_page: 100 })
    return response.data.map((repository) => {
      const [owner, repositoryName] = repository.full_name.split('/')
      return { owner: owner, name: repositoryName }
    })
  }

  async getUser(authToken: string): Promise<User> {
    const octokit = new Octokit({ auth: authToken })
    const response = await octokit.request('GET /user')
    return {
      username: response.data.login,
      avatar: { url: response.data.avatar_url },
    }
  }

  toFullName(repository: Repository): string {
    return `${repository.owner}/${repository.name}`
  }
}
