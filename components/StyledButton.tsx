'use client'

import React, { forwardRef, ForwardRefRenderFunction } from 'react'
import { classNames } from './lib/styling'
import { Actions, EdgeStyle, Size } from './StyledButtonEnums'

export interface StyledButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  actionType: Actions
  size?: Size
  edgeStyle?: EdgeStyle
}

const StyledButton: ForwardRefRenderFunction<
  HTMLButtonElement,
  React.PropsWithChildren<StyledButtonProps>
> = ({ actionType, size, edgeStyle, children, ...props }, ref) => {
  let colorClasses = ''
  switch (actionType) {
    case Actions.primary:
      colorClasses =
        'text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 disabled:hover:bg-indigo-300'
      break
    case Actions.positive:
      colorClasses =
        'text-white bg-green-600 hover:bg-green-500 disabled:bg-green-300 ring-gray-300 disabled:hover:bg-green-300'
      break
    case Actions.negative:
      colorClasses =
        'text-white bg-red-600 hover:bg-red-500 disabled:bg-red-300 disabled:hover:bg-red-300'
      break
    case Actions.neutral:
      colorClasses =
        'menu-item-colors bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-gray-100 ring-1 ring-inset ring-gray-300 disabled:ring-0'
      break
    default:
      throw new Error('Unknown button action type')
  }

  let sizeClasses = ''
  switch (size ?? Size.md) {
    case Size.sm:
      sizeClasses = 'py-1.5 px-1.5 text-xs'
      break
    case Size.md:
      sizeClasses = 'py-1.5 px-2.5 text-sm'
      break
    case Size.lg:
      sizeClasses = 'py-2 px-3 text-sm'
      break
    case Size.xl:
      sizeClasses = 'py-2.5 px-3.5 text-sm'
      break
  }

  let edgeClasses = ''
  switch (edgeStyle) {
    case EdgeStyle.rounded:
      edgeClasses = 'rounded-full'
      break
    case EdgeStyle.edged:
    default:
      edgeClasses = 'rounded'
      break
  }

  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      ref={ref}
      className={classNames(
        'font-medium shadow-sm',
        colorClasses,
        sizeClasses,
        edgeClasses,
        props.className ?? '',
      )}
    >
      {children}
    </button>
  )
}

export default forwardRef(StyledButton)
