import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
} from 'react'
import DynamicIcon, { IconTheme } from './DynamicIcon'
import { Route } from 'next'
import { default as NextLink } from 'next/link'

export interface DropDownEntryProps {
  label: string
  iconName?: string
  iconTheme?: IconTheme
  target?: Route
  onClickHandler?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const DropDownEntry: ForwardRefRenderFunction<
  HTMLAnchorElement | HTMLButtonElement,
  DropDownEntryProps
> = (props: DropDownEntryProps, ref) => {
  const elementClasses =
    'w-full px-4 py-2 flex flex-row gap-4 items-center menu-item-colors group'

  if (props.target !== undefined) {
    return (
      <NextLink
        href={props.target}
        className={elementClasses}
        ref={ref as ForwardedRef<HTMLAnchorElement>}
      >
        {props.label}
      </NextLink>
    )
  }

  if (props.onClickHandler !== undefined) {
    return (
      <button
        type="button"
        className={elementClasses}
        onClick={props.onClickHandler}
        ref={ref as ForwardedRef<HTMLButtonElement>}
      >
        {props.iconName && (
          <DynamicIcon
            iconTheme={props.iconTheme ?? IconTheme.SolidIcons20}
            iconName={props.iconName}
            className="icon-size"
          />
        )}
        {props.label}
      </button>
    )
  }

  throw new Error('Either a target or onClickHandler must be provided')
}

export default forwardRef(DropDownEntry)
