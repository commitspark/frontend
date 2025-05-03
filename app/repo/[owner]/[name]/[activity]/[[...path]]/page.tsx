import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { commitsparkConfig } from '@commitspark-config'
import { ViewSwitcherProps } from '@/lib/types'
import {
  ActivitiesProvider,
  ActivityRouteDefinition,
} from '@/components/context/ActivitiesProvider'
import Loading from '@/components/Loading'
import Navbar from '@/components/shell/Navbar'
import { RepositoryInfoProvider } from '@/components/context/RepositoryInfoProvider'
import TransientNotificationsArea from '@/components/shell/TransientNotificationsArea'

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
      name: activity.name,
      initialRoute: `/repo/${owner}/${name}/${activity.id}/`,
    }))

  return (
    <>
      <RepositoryInfoProvider initialValue={repositoryInfo}>
        <ActivitiesProvider
          initialValue={{
            idCurrentActivity: idCurrentActivity,
            availableActivities: activities,
          }}
        >
          <div className="h-full flex flex-col">
            <Navbar />
            <div className="flex-1 min-h-0 flex">
              <Suspense fallback={<Loading />}>
                <ViewSwitcher owner={owner} name={name} path={cleanedPath} />
              </Suspense>
            </div>
          </div>
        </ActivitiesProvider>
      </RepositoryInfoProvider>
      <TransientNotificationsArea />
    </>
  )
}
