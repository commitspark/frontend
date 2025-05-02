import React, { ReactElement } from 'react'
import { GitAdapter } from '@commitspark/git-adapter'
import { Provider } from '@/lib/provider/provider'

export interface CommitsparkConfig {
  getProviderLabel: () => string
  getProviderIcon: <P extends React.HTMLAttributes<HTMLElement>>(
    props: P,
  ) => ReactElement<P> | null
  createProvider: () => Provider
  createGitAdapter: (
    repositoryOptions: RepositoryOptions,
  ) => Promise<GitAdapter>
  activities: ActivityDefinition[]
}

export interface RepositoryOptions {
  repositoryOwner: string
  repositoryName: string
  accessToken: string
}

export interface ViewSwitcherProps {
  owner: string
  name: string
  path: string[]
}

export type ViewSwitcher = React.FC<ViewSwitcherProps>

export interface ActivityDefinition {
  id: ActivityID
  iconName: string
  name: string
  viewSwitcher: ViewSwitcher
  routeGenerator: RouteGenerator
}

export interface RouteGenerator {
  (routeId: RouteID, routeArguments: string[]): string
}

export type ActivityID = string
export type RouteID = string
