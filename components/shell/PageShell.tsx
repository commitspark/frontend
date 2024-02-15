import React from 'react'
import Navbar from './Navbar'

interface PageShellProps {}

const PageShell: React.FC<React.PropsWithChildren<PageShellProps>> = (
  props: React.PropsWithChildren<PageShellProps>,
) => {
  return (
    <>
      <div className="h-full flex flex-col">
        <Navbar />

        <div className="flex-1 min-h-0 flex">{props.children}</div>
      </div>
    </>
  )
}

export default PageShell
