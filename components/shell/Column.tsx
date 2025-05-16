import React, { ReactElement } from 'react'
import { PageHeadingProps } from '../PageHeading'

export interface ColumnProps {
  pageHeading: ReactElement<PageHeadingProps>
}

const Column: React.FC<React.PropsWithChildren<ColumnProps>> = (
  props: React.PropsWithChildren<ColumnProps>,
) => {
  return (
    <div className="flex flex-col">
      {props.pageHeading}
      <div className="p-4 overflow-y-auto">{props.children}</div>
    </div>
  )
}

export default Column
