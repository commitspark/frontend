import React, { ReactElement } from 'react'
import { EntryData, GitAdapter } from '@commitspark/git-adapter'
import { Provider } from '@/lib/provider/provider'
import { GraphQLInputType, GraphQLSchema } from 'graphql/type'
import { SessionPayload } from '@/components/lib/session'

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

export interface ActivityViewProps {
  owner: string
  name: string
  path: string[]
}

export type ActivityView = React.FC<ActivityViewProps>

export interface ActivityDefinition {
  id: ActivityID
  iconName: string
  name: string
  view: ActivityView
  routeGenerator: RouteGenerator
  initialRouteGenerator: (
    repositoryOwner: string,
    repositoryName: string,
  ) => string
}

export interface RouteGenerator {
  (routeId: RouteID, routeArguments: string[]): string
}

export type ActivityID = string
export type RouteID = string

export type MutationType = 'create' | 'update'

export interface CommitsparkHooks {
  preCommit?: CommitHook
}

export interface CommitHook {
  (
    sessionPayload: SessionPayload,
    repositoryOwner: string,
    repositoryName: string,
    ref: string,
    schema: GraphQLSchema,
    mutationType: MutationType,
    inputType: GraphQLInputType,
    entryData: EntryData,
  ): Promise<EntryData>
}
