import { Branch, Provider, Repository, User } from '../provider'
import { Octokit } from 'octokit'

export class GitHubProvider implements Provider {
  async getBranches(
    authToken: string,
    repository: Repository,
  ): Promise<Branch[]> {
    const octokit = new Octokit({ auth: authToken })
    const response = await octokit.request(
      `GET /repos/${repository.owner}/${repository.name}/branches`,
      {
        request: {
          // don't use cache for now to make sure branches are always up-to-date; see https://github.com/octokit/octokit.js/issues/890
          cache: 'reload',
        },
      },
    )
    return response.data
  }

  async getRepositories(authToken: string): Promise<Repository[]> {
    const octokit = new Octokit({ auth: authToken })
    const response = await octokit.request('GET /user/repos')
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
