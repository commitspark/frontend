import React from 'react'

interface LineCenteredElementProps {}

const LineCenteredElement: React.FC<
  React.PropsWithChildren<LineCenteredElementProps>
> = (props: React.PropsWithChildren<LineCenteredElementProps>) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="flex-grow border-b app-border-color" />
      </div>
      <div className="relative flex justify-center">{props.children}</div>
    </div>
  )
}

export default LineCenteredElement
