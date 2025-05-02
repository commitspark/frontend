import type { Route } from 'next'
import { commitsparkConfig } from '@commitspark-config'

export const routes = {
  repositoryList,
  signIn,
  settings,
  defaultActivity,
}

function repositoryList(): Route {
  return `/` as Route
}

function signIn(): Route {
  return `/sign-in/` as Route
}

function settings(): Route {
  return `/settings/` as Route
}

function defaultActivity(owner: string, repository: string): Route {
  const activities = commitsparkConfig.activities
  if (activities.length === 0) {
    throw new Error('No activities found.')
  }

  const firstActivity = activities[0]
  return `/repo/${owner}/${repository}/${firstActivity.id}/`
}
