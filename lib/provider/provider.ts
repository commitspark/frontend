export interface Provider {
  getUser: (authToken: string) => Promise<User>
  getRepositories: (authToken: string) => Promise<Repository[]>
  getBranches: (authToken: string, repository: Repository) => Promise<Branch[]>
  createBranch: (
    authToken: string,
    repository: Repository,
    sourceRef: string,
    branchName: string,
  ) => Promise<Branch>
  toFullName: (repository: Repository) => string
}

export interface User {
  username: string
  avatar: Avatar
}

export interface Avatar {
  url: string // must be a publicly accessible URL
}

export interface Repository {
  name: string
  owner: string
}

export interface Branch {
  name: string
  protected: boolean
  commit: Commit
}

export interface Commit {
  sha: string
  url: string
}
