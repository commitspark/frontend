'use client'

import React from 'react'
import NavbarEntries from './NavbarEntries'
import logo from '../../app/icon.png'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { default as NextLink } from 'next/link'
import { deleteCookie } from 'cookies-next'
import { COOKIE_PROVIDER_TOKEN_GITHUB } from '../../lib/cookies'
import { DropDownEntryProps } from '../DropDownEntry'

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = (props: NavbarProps) => {
  const router = useRouter()
  const userMenuEntries: DropDownEntryProps[] = [
    {
      label: 'Settings',
      target: `/settings/`,
    },
    {
      label: 'Sign out',
      onClickHandler: (event) => {
        deleteCookie(COOKIE_PROVIDER_TOKEN_GITHUB)
        router.push(`/`)
      },
    },
  ]

  return (
    <header className="menu-bar-height flex">
      {/* Logo area */}
      <div className="flex-none">
        <NextLink
          href={`/p/github/`} // TODO generalize provider
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
