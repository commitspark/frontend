import React from 'react'
import Link from 'next/link'
import StyledButton from './StyledButton'
import { Actions, Size } from './StyledButtonEnums'

interface NotFoundProps {}

const NotFound: React.FC<NotFoundProps> = (props: NotFoundProps) => {
  return (
    <main className="p-6 grid min-h-screen place-items-center bg-white">
      <div>
        <p className="text-center text-indigo-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Page not found
        </h1>
        <div className="mt-10 flex justify-center">
          <Link href={'/'}>
            <StyledButton actionType={Actions.primary} size={Size.lg}>
              Return to Home
            </StyledButton>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default NotFound
