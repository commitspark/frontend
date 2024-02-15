import React from 'react'
import * as SolidIcons20 from '@heroicons/react/20/solid'
import * as OutlineIcons24 from '@heroicons/react/24/outline'
import * as SolidIcons24 from '@heroicons/react/24/solid'

export enum IconTheme {
  SolidIcons20,
  OutlineIcons24,
  SolidIcons24,
}

interface DynamicIconProps extends React.HTMLAttributes<HTMLElement> {
  iconTheme: IconTheme
  iconName: string
}

const DynamicIcon: React.FC<DynamicIconProps> = ({
  iconName,
  iconTheme,
  ...props
}: DynamicIconProps) => {
  // see https://stackoverflow.com/questions/69547316/dynamic-heroicons-import-with-next-js

  let Icon: JSX.Element
  if (iconTheme === IconTheme.SolidIcons20) {
    const { ...icons } = SolidIcons20
    // @ts-ignore
    Icon = icons[iconName]
  } else if (iconTheme === IconTheme.OutlineIcons24) {
    const { ...icons } = OutlineIcons24
    // @ts-ignore
    Icon = icons[iconName]
  } else if (iconTheme === IconTheme.SolidIcons24) {
    const { ...icons } = SolidIcons24
    // @ts-ignore
    Icon = icons[iconName]
  } else {
    throw new Error('Unexpected iconTheme')
  }

  return (
    <>
      {/* @ts-ignore */}
      <Icon {...props} />
    </>
  )
}

export default DynamicIcon
