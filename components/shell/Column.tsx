import React, { ReactElement } from 'react'
import { PageHeadingProps } from '../PageHeading'

export interface ColumnProps {
  pageHeading: ReactElement<PageHeadingProps>
}

const Column: React.FC<React.PropsWithChildren<ColumnProps>> = (
  props: React.PropsWithChildren<ColumnProps>,
) => {
  return (
    <>
      {props.pageHeading}
      <div className="p-4 overflow-y-auto">{props.children}</div>
    </>
  )
}

export default Column
