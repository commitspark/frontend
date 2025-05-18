import React, { PropsWithChildren } from 'react'
import BranchIcon, {
  BranchIconWeight,
} from '@/components/editing/icons/BranchIcon'
import { Squares2X2Icon } from '@heroicons/react/24/outline'

export interface EditorHeadingProps {
  entryId: string
  entryTypeName: string
  branchName: string
}

const EditorHeading: React.FC<PropsWithChildren<EditorHeadingProps>> = (
  props: PropsWithChildren<EditorHeadingProps>,
) => {
  return (
    <header className="flex flex-row gap-x-4 items-center">
      <h1 className="font-semibold text-color order-first">{props.entryId}</h1>
      <div className="text-sm font-light text-color-light min-w-0 flex">
        <div className="pr-1 inline-flex items-baseline">
          <BranchIcon weight={BranchIconWeight.Light} />
        </div>
        <span className="min-w-0 truncate sm:max-w-[200px] lg:max-w-[300px]">
          {props.branchName}
        </span>
      </div>
      <div className="text-sm font-light text-color-light min-w-0 flex">
        <div className="pr-1 inline-flex items-baseline">
          <Squares2X2Icon className="icon-size" />
        </div>
        <span className="min-w-0 truncate sm:max-w-[200px] lg:max-w-[300px]">
          {props.entryTypeName}
        </span>
      </div>
      <div className="flex-grow" />
      <div className="order-2 lg:order-last justify-self-end">
        {props.children}
      </div>
    </header>
  )
}

export default EditorHeading
