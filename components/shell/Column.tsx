import React, { ReactElement } from 'react'
import { EditorHeadingProps } from '../editor/EditorHeading'

export interface ColumnProps {
  pageHeading: ReactElement<EditorHeadingProps>
}

const Column: React.FC<React.PropsWithChildren<ColumnProps>> = (
  props: React.PropsWithChildren<ColumnProps>,
) => {
  return (
    <div className="pb-4">
      <div className="bg-cs-bg-layout sticky top-0 z-20">
        <div className="p-4">{props.pageHeading}</div>
      </div>
      <div className="px-4">{props.children}</div>
    </div>
  )
}

export default Column
