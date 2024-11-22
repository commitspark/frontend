import React, { PropsWithChildren } from 'react'
import { Overpass } from 'next/font/google'

import '../styles/tailwind.css'
import { classNames } from '../components/lib/styling'
import { Metadata } from 'next'
import { TransientNotificationProvider } from '../components/context/TransientNotificationProvider'
import { NavigationGuardProvider } from 'next-navigation-guard'

const overpass = Overpass({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
})

interface ProviderLayoutProps {}

export const metadata: Metadata = {
  title: 'Commitspark',
}

const ProviderLayout: React.FC<React.PropsWithChildren<ProviderLayoutProps>> = (
  props: PropsWithChildren<ProviderLayoutProps>,
) => {
  return (
    <html lang="en" className={'h-full overflow-y-hidden'}>
      <body className={classNames(overpass.className, 'h-full')}>
        <NavigationGuardProvider>
          <TransientNotificationProvider>
            {props.children}
          </TransientNotificationProvider>
        </NavigationGuardProvider>
      </body>
    </html>
  )
}

export default ProviderLayout
