import React from 'react'
import IconButton from '../../../IconButton'
import { Actions, Size } from '../../../StyledButtonEnums'

interface ReorderHandleProps {
  id: number
  moveUpHandler: (id: number) => void
  moveDownHandler: (id: number) => void
}

const ReorderHandle: React.FC<ReorderHandleProps> = (
  props: ReorderHandleProps,
) => {
  return (
    <div className="pr-3 flex flex-col">
      <IconButton
        iconName={'ChevronUpIcon'}
        actionType={Actions.neutral}
        size={Size.sm}
        onClick={() => props.moveUpHandler(props.id)}
      />
      <div className={'flex-grow min-h-[2px]'} />
      <IconButton
        iconName={'ChevronDownIcon'}
        actionType={Actions.neutral}
        size={Size.sm}
        onClick={() => props.moveDownHandler(props.id)}
      />
    </div>
  )
}

export default ReorderHandle
