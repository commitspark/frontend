import React, { forwardRef, ForwardRefRenderFunction } from 'react'
import StyledButton, { StyledButtonProps } from './StyledButton'
import DynamicIcon, { IconTheme } from './DynamicIcon'
import { classNames } from './lib/styling'

interface IconButtonProps extends StyledButtonProps {
  iconName: string
  iconPosition?: IconPosition
}

export enum IconPosition {
  preceding,
  succeeding,
}

const IconButton: ForwardRefRenderFunction<
  HTMLButtonElement,
  React.PropsWithChildren<IconButtonProps>
> = ({ iconName, iconPosition, children, ...buttonProps }, ref) => {
  const icon = (
    <DynamicIcon
      iconTheme={IconTheme.SolidIcons20}
      iconName={iconName}
      className="icon-size"
    />
  )
  return (
    <StyledButton ref={ref} {...buttonProps}>
      <div
        className={classNames(
          'flex flex-row items-center',
          iconPosition === IconPosition.succeeding ? 'flex-row-reverse' : '',
        )}
      >
        <div>{icon}</div>
        {children && <div className={'mt-0.5 mx-1'}>{children}</div>}
      </div>
    </StyledButton>
  )
}

export default forwardRef(IconButton)
