'use client'

import React from 'react'
import logo from '../../app/icon.png'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link, { default as NextLink } from 'next/link'
import { DropDownEntryProps } from '@/components/DropDownEntry'
import { routes } from '../lib/route-generator'
import { removeAuthentication } from '@/components/lib/session'
import { classNames } from '@/components/lib/styling'
import Avatar from '@/components/shell/Avatar'
import { useActivities } from '@/components/context/ActivitiesProvider'
import { useRepositoryInfo } from '@/components/context/RepositoryInfoProvider'
import DynamicIcon, { IconTheme } from '@/components/DynamicIcon'
import DropDown from '@/components/DropDown'

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = (props: NavbarProps) => {
  const router = useRouter()
  const repositoryInfoState = useRepositoryInfo()
  const activities = useActivities()

  const userMenuEntries: DropDownEntryProps[] = [
    {
      label: 'Sign out',
      onClickHandler: async (event) => {
        await removeAuthentication()
        router.push(routes.signIn())
      },
    },
  ]

  return (
    <header className="border-b border-gray-300">
      <div className="px-2 sm:px-4">
        <div className="h-16 relative flex">
          {/* Logo */}
          <div className="relative flex px-2">
            <NextLink
              href={routes.repositoryList()}
              className={'flex items-center justify-center'}
            >
              <Image
                src={logo}
                alt="Commitspark logo"
                className="avatar-size"
              />
            </NextLink>
          </div>

          {/* Repository */}
          <div className="pl-2 flex-grow flex items-center">
            {repositoryInfoState?.repository &&
              repositoryInfoState.owner &&
              repositoryInfoState.repository && (
                <div className="flex flex-col xs:flex-row space-x-1.5">
                  <div className="max-xs:text-sm">
                    {repositoryInfoState?.owner}
                  </div>
                  <div className="hidden xs:block">/</div>
                  <div>{repositoryInfoState?.repository}</div>
                </div>
              )}
          </div>

          <div className="relative ml-4 flex items-center">
            <DropDown
              customElement={<Avatar />}
              menuEntries={userMenuEntries}
            />
          </div>
        </div>

        {/* Second row */}
        <nav className="flex lg:gap-x-2">
          {activities?.availableActivities.map((activity) => (
            <Link
              key={activity.id}
              href={activity.initialRoute}
              aria-current={
                activity.id === activities?.idCurrentActivity
                  ? 'page'
                  : undefined
              }
              className={classNames(
                activity.id === activities?.idCurrentActivity
                  ? 'border-b border-b-indigo-700'
                  : '',
                'menu-item-colors inline-flex items-center gap-x-2 px-3 py-2 menu-item-typography',
              )}
            >
              <DynamicIcon
                iconTheme={IconTheme.OutlineIcons24}
                iconName={activity.iconName}
                className={'icon-size'}
              />
              {activity.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
