import React from 'react'
import StyledButton from '@/components/StyledButton'
import { Actions } from '@/components/StyledButtonEnums'

interface SelectMenuLoadingProps {}

const SelectMenuLoading: React.FC<SelectMenuLoadingProps> = (
  props: SelectMenuLoadingProps,
) => {
  return (
    <StyledButton actionType={Actions.neutral}>
      <div className="min-w-52 flex flex-row gap-x-1.5 animate-pulse">
        <div className="icon-size h-2 bg-gray-700 rounded col-span-1"></div>
        <div className="flex-grow h-2 bg-gray-700 rounded col-span-3"></div>
        <div className="icon-size h-2 bg-gray-700 rounded col-span-1"></div>
      </div>
    </StyledButton>
  )
}

export default SelectMenuLoading
