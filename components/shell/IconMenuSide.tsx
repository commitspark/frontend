'use client'

import React from 'react'
import { classNames } from '../lib/styling'
import { ActivityState, useActivity } from '../context/ActivityProvider'
import Link from 'next/link'
import DynamicIcon, { IconTheme } from '../DynamicIcon'

interface IconMenuSideProps {}

const IconMenuSide: React.FC<IconMenuSideProps> = (
  props: IconMenuSideProps,
) => {
  const activity = useActivity() as ActivityState

  return (
    <nav className="flex-none vertical-nav-width vertical-nav-background overflow-y-auto">
      <div className="p-3 flex flex-col gap-y-3">
        {activity.availableActivities.map((activityEntry) => (
          <Link
            href={activityEntry.link}
            key={activityEntry.key}
            className={classNames(
              activityEntry.key === activity.currentActivity
                ? 'menu-item-dark-colors-selected'
                : 'menu-item-dark-colors',
              'aspect-square rounded-md inline-flex items-center justify-center',
            )}
          >
            <>
              <DynamicIcon
                iconTheme={IconTheme.OutlineIcons24}
                iconName={activityEntry.iconName}
                className={'icon-size-lg'}
              />
            </>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default IconMenuSide
