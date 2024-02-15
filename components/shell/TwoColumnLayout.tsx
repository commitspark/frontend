import React, { ReactNode } from 'react'

interface TwoColumnLayoutProps {
  asideColumn: ReactNode
}

const TwoColumnLayout: React.FC<
  React.PropsWithChildren<TwoColumnLayoutProps>
> = (props: React.PropsWithChildren<TwoColumnLayoutProps>) => {
  /* small screen: show aside column above child content, large screen: show left of child content */
  return (
    <div
      className={
        'flex flex-col lg:flex-row h-full overflow-y-auto lg:overflow-hidden'
      }
    >
      <aside className="lg:flex-none lg:h-full lg:w-72 xl:w-96 flex flex-col lg:overflow-y-auto border-b lg:border-b-0 lg:border-r app-border-color bg-gray-100">
        {props.asideColumn}
      </aside>

      <section className="flex-grow h-full flex flex-col">
        {props.children}
      </section>
    </div>
  )
}

export default TwoColumnLayout
