import React, { ReactElement, ReactNode } from 'react'
import {
  RepositoryInfoProvider,
  RepositoryInfoState,
} from '../context/RepositoryInfoProvider'
import PageShell from './PageShell'
import TwoColumnLayout from './TwoColumnLayout'
import { ColumnProps } from './Column'
import IconMenuLayout from './IconMenuLayout'
import { BranchSelectorColumnProps } from './BranchSelectorColumn'
import { ActivityProvider, ActivityState } from '../context/ActivityProvider'
import { routes } from '../lib/route-generator'
import { assertIsString } from '../lib/assert'
import TransientNotificationsArea from './TransientNotificationsArea'

export enum Layout {
  SingleArea,
  TwoColumn,
}

export enum Activity {
  editing,
}

interface ApplicationProps {
  repositoryInfo: RepositoryInfoState
  layout: Layout
  primaryColumn: ReactNode
  asideColumn:
    | ReactElement<ColumnProps>
    | ReactElement<BranchSelectorColumnProps>
    | null
  activity: Activity | null
}

const Application: React.FC<React.PropsWithChildren<ApplicationProps>> = (
  props: React.PropsWithChildren<ApplicationProps>,
) => {
  let currentScreen = null
  switch (props.layout) {
    case Layout.SingleArea:
      currentScreen = props.primaryColumn
      break
    case Layout.TwoColumn:
      if (props.activity === null) {
        throw new Error('Expected activity')
      }
      currentScreen = (
        <>
          <IconMenuLayout>
            <TwoColumnLayout asideColumn={props.asideColumn}>
              {props.primaryColumn}
            </TwoColumnLayout>
          </IconMenuLayout>
        </>
      )
      break
  }

  let activityState: ActivityState | null = null
  if (props.activity !== null) {
    const owner = props.repositoryInfo.owner
    const repository = props.repositoryInfo.repository
    assertIsString(owner)
    assertIsString(repository)

    activityState = {
      currentActivity: props.activity,
      availableActivities: [
        {
          key: Activity.editing,
          name: 'Edit',
          iconName: 'PencilSquareIcon',
          link: routes.editingStartScreen(owner, repository),
        },
      ],
    }
  }

  return (
    <>
      <RepositoryInfoProvider initialValue={props.repositoryInfo}>
        <ActivityProvider initialValue={activityState}>
          <PageShell>{currentScreen}</PageShell>
        </ActivityProvider>
      </RepositoryInfoProvider>
      <TransientNotificationsArea />
    </>
  )
}

export default Application
