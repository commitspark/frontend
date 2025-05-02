import React, { Suspense } from 'react'
import { getCookieSession } from '@/components/lib/session'
import { fetchBranches } from '@/components/lib/git-functions'
import BranchSelectorColumn from '@/components/shell/BranchSelectorColumn'
import Application, { Layout } from '@/components/shell/Application'
import { notFound } from 'next/navigation'
import { commitsparkConfig } from '@commitspark-config'
import { ViewSwitcherProps } from '@/lib/types'
import { ActivityRouteDefinition } from '@/components/context/ActivitiesProvider'
import Loading from '@/components/Loading'

interface ApplicationPageParams {
  owner: string
  name: string
  activity: string
  path?: string[] | undefined
}

export default async function ApplicationPage({
  params,
}: {
  params: Promise<ApplicationPageParams>
}) {
  const { owner, name, activity, path } = await params

  const cleanedPath = path ?? []
  const repositoryInfo = {
    owner: owner,
    repository: name,
  }

  const session = await getCookieSession()
  const branches = await fetchBranches(
    session,
    repositoryInfo.owner,
    repositoryInfo.repository,
  )
  const currentBranch =
    cleanedPath.length >= 2 && cleanedPath[0] === 'ref'
      ? decodeURIComponent(cleanedPath[1])
      : null

  const branchSelectorColumn = (
    <BranchSelectorColumn
      repositoryInfo={repositoryInfo}
      branches={branches}
      currentBranch={currentBranch}
    />
  )

  let idCurrentActivity: string | null = null
  let ViewSwitcher: React.FC<ViewSwitcherProps> | null = null
  for (const configuredActivity of commitsparkConfig.activities) {
    if (
      configuredActivity.id === activity &&
      (ViewSwitcher = configuredActivity.viewSwitcher) !== null
    ) {
      idCurrentActivity = configuredActivity.id
      break
    }
  }

  if (idCurrentActivity === null || ViewSwitcher === null) {
    notFound()
  }

  const activities: ActivityRouteDefinition[] =
    commitsparkConfig.activities.map((activity) => ({
      id: activity.id,
      iconName: activity.iconName,
      initialRoute: `/repo/${owner}/${name}/${activity.id}/`,
    }))

  return (
    <Application
      layout={Layout.TwoColumn}
      activities={{
        idCurrentActivity: idCurrentActivity,
        availableActivities: activities,
      }}
      repositoryInfo={repositoryInfo}
      asideColumn={branchSelectorColumn}
    >
      <Suspense fallback={<Loading />}>
        <ViewSwitcher owner={owner} name={name} path={cleanedPath} />
      </Suspense>
    </Application>
  )
}
