import React from 'react'
import IconButton from '../../../IconButton'
import { Actions, Size } from '../../../StyledButtonEnums'

interface DragHandleProps {
  pointerDownChangedHandler: (isDown: boolean) => void
}

const DragHandle: React.FC<DragHandleProps> = (props: DragHandleProps) => {
  return (
    <div className="pr-3 flex">
      <IconButton
        iconName={'ChevronUpDownIcon'}
        actionType={Actions.neutral}
        className={'cursor-move'}
        size={Size.sm}
        onPointerDown={() => props.pointerDownChangedHandler(true)}
        onPointerUp={() => props.pointerDownChangedHandler(false)}
      />
    </div>
  )
}

export default DragHandle
