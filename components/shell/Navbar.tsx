'use client'

import React from 'react'
import NavbarEntries from './NavbarEntries'
import logo from '../../app/icon.png'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { default as NextLink } from 'next/link'
import { DropDownEntryProps } from '../DropDownEntry'
import { commitsparkConfig } from '../../commitspark.config'
import { routes } from '../lib/route-generator'

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = (props: NavbarProps) => {
  const router = useRouter()
  const userMenuEntries: DropDownEntryProps[] = [
    {
      label: 'Sign out',
      onClickHandler: async (event) => {
        await commitsparkConfig.createAuthenticator().removeAuthentication()
        router.push(routes.signIn())
      },
    },
  ]

  return (
    <header className="menu-bar-height flex">
      {/* Logo area */}
      <div className="flex-none">
        <NextLink
          href={routes.repositoryList()}
          className={
            'vertical-nav-width menu-bar-height vertical-nav-background flex aspect-square items-center justify-center'
          }
        >
          <Image src={logo} alt="Commitspark logo" className="avatar-size" />
        </NextLink>
      </div>

      <NavbarEntries userNavigation={userMenuEntries} />
    </header>
  )
}

export default Navbar
