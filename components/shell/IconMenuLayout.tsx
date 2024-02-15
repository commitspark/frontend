import React from 'react'
import IconMenuSide from './IconMenuSide'

interface IconMenuLayoutProps {}

const IconMenuLayout: React.FC<React.PropsWithChildren<IconMenuLayoutProps>> = (
  props: React.PropsWithChildren<IconMenuLayoutProps>,
) => {
  return (
    <>
      <IconMenuSide />

      <main className="w-full">{props.children}</main>
    </>
  )
}

export default IconMenuLayout
