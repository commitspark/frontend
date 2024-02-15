import SignIn from '../../components/SignIn'
import { Metadata } from 'next'

export const metadata: Metadata = {
  robots: 'noindex',
}

export const dynamicParams = false

export default async function SignInPage({ params }: { params: any }) {
  return (
    <>
      <div className="grid w-screen h-screen bg-gray-50 items-center justify-center">
        <SignIn />
      </div>
    </>
  )
}
