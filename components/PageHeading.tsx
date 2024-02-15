import React, { PropsWithChildren } from 'react'
import type { Route } from 'next'
import BackButton from './shell/BackButton'

export interface PageHeadingProps {
  title: string
  subTitle?: string
  backLink?: Route
}

const PageHeading: React.FC<PropsWithChildren<PageHeadingProps>> = (
  props: PropsWithChildren<PageHeadingProps>,
) => {
  return (
    <header className={'menu-bar-height flex flex-row gap-x-4 items-center'}>
      {props.backLink && (
        <BackButton href={props.backLink} className={'border-r'} />
      )}
      <h1 className="font-semibold text-color">{props.title}</h1>
      {props.subTitle && <h2 className="text-color-light">{props.subTitle}</h2>}
      <div className="flex-grow" />
      <div>{props.children}</div>
    </header>
  )
}

export default PageHeading
