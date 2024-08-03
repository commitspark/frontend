import React from 'react'
import logo from '../app/icon.png'
import Image from 'next/image'
import GitHubIcon from './elements/icons/GitHubIcon'
import Link from 'next/link'
import StyledButton from './StyledButton'
import { Actions, Size } from './StyledButtonEnums'
import { unstable_noStore as noStore } from 'next/cache'
import { GithubAuthenticator } from '../lib/provider/github/github-authenticator'

interface SignInProps {}

const SignIn: React.FC<SignInProps> = (props: SignInProps) => {
  // ensure environment variables are set to server-side values at runtime
  noStore()

  const authenticator = new GithubAuthenticator()

  return (
    <div className="max-w-md flex flex-col gap-y-8 items-center">
      <Image src={logo} alt="Commitspark logo" className="avatar-size" />
      <h2 className="text-2xl font-bold">Sign in to Commitspark</h2>
      <div className="flex flex-col bg-white shadow p-8 rounded items-center gap-y-6">
        <div className="text-sm text-gray-500">Sign in with</div>
        <Link href={authenticator.getAuthenticationUrl()} className={'w-full'}>
          <StyledButton
            actionType={Actions.neutral}
            size={Size.xl}
            className={'w-full'}
          >
            <div className="flex justify-center">
              <div className="flex flex-row gap-x-3 items-center px-12">
                GitHub
                <GitHubIcon className="avatar-size" />
              </div>
            </div>
          </StyledButton>
        </Link>
      </div>
    </div>
  )
}

export default SignIn
