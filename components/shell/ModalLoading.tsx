import React from 'react'

interface ModalLoadingProps {}

const ModalLoading: React.FC<ModalLoadingProps> = (
  props: ModalLoadingProps,
) => {
  return (
    <div className="fixed inset-0 z-10 w-screen flex justify-center items-center bg-gray-400/50">
      <div className="rounded-lg bg-white shadow-xl p-20">Loading...</div>
    </div>
  )
}

export default ModalLoading
