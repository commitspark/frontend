import React, { ReactElement } from 'react'
import {
  RepositoryInfoProvider,
  RepositoryInfoState,
} from '../context/RepositoryInfoProvider'
import PageShell from './PageShell'
import TwoColumnLayout from './TwoColumnLayout'
import { ColumnProps } from './Column'
import IconMenuLayout from './IconMenuLayout'
import { BranchSelectorColumnProps } from './BranchSelectorColumn'
import {
  ActivitiesProvider,
  ActivitiesState,
} from '../context/ActivitiesProvider'
import TransientNotificationsArea from './TransientNotificationsArea'

export enum Layout {
  SingleArea,
  TwoColumn,
}

interface ApplicationProps {
  repositoryInfo: RepositoryInfoState
  layout: Layout
  asideColumn:
    | ReactElement<ColumnProps>
    | ReactElement<BranchSelectorColumnProps>
    | null
  activities: ActivitiesState
}

const Application: React.FC<React.PropsWithChildren<ApplicationProps>> = (
  props: React.PropsWithChildren<ApplicationProps>,
) => {
  let currentScreen = null
  switch (props.layout) {
    case Layout.SingleArea:
      currentScreen = props.children
      break
    case Layout.TwoColumn:
      currentScreen = (
        <>
          <IconMenuLayout>
            <TwoColumnLayout asideColumn={props.asideColumn}>
              {props.children}
            </TwoColumnLayout>
          </IconMenuLayout>
        </>
      )
      break
  }

  return (
    <>
      <RepositoryInfoProvider initialValue={props.repositoryInfo}>
        <ActivitiesProvider initialValue={props.activities}>
          <PageShell>{currentScreen}</PageShell>
        </ActivitiesProvider>
      </RepositoryInfoProvider>
      <TransientNotificationsArea />
    </>
  )
}

export default Application
