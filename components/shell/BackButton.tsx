import React from 'react'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Route } from 'next'
import { classNames } from '../lib/styling'

interface BackButtonProps {
  href: Route
  className?: string
}

const BackButton: React.FC<React.PropsWithChildren<BackButtonProps>> = (
  props: React.PropsWithChildren<BackButtonProps>,
) => {
  return (
    <Link
      className={classNames(
        'menu-bar-height flex items-center px-4 py-2 menu-item-colors',
        props.className,
      )}
      href={props.href}
    >
      <ChevronLeftIcon className="icon-size" />
    </Link>
  )
}

export default BackButton
