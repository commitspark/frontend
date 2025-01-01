'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import StyledButton from '../components/StyledButton'
import { Actions, Size } from '../components/StyledButtonEnums'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="p-6 grid min-h-screen place-items-center bg-white">
      <div className="flex flex-col gap-y-4">
        <p className="text-center text-indigo-600">500</p>
        <h1 className="text-center text-2xl font-bold text-gray-900">
          Something went wrong!
        </h1>
        <p className="text-center text-gray-600">{error.message}</p>
        <div className="mt-6 flex justify-center">
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
