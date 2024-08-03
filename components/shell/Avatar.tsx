'use client'

import React, { useEffect, useState } from 'react'
import {
  RepositoryInfoState,
  useRepositoryInfo,
} from '../context/RepositoryInfoProvider'
import { getCookie } from 'cookies-next'
import { COOKIE_PROVIDER_TOKEN_GITHUB } from '../../lib/cookies'
import { GitHubProvider } from '../../lib/provider/github/github-provider'
import { User } from '../../lib/provider/provider'

interface AvatarProps {}

const Avatar: React.FC<React.PropsWithChildren<AvatarProps>> = (
  props: React.PropsWithChildren<AvatarProps>,
) => {
  const repositoryInfoState = useRepositoryInfo() as RepositoryInfoState
  const token = `${getCookie(COOKIE_PROVIDER_TOKEN_GITHUB)}`

  const [userInfo, setUserInfo] = useState<User | null>(null)

  useEffect(() => {
    async function fetchUserInfo() {
      setUserInfo(null)
      const provider = new GitHubProvider()
      const user = await provider.getUser(token)
      if (!ignore) {
        setUserInfo(user)
      }
    }

    let ignore = false
    fetchUserInfo()
    return () => {
      ignore = true
    }
  }, [token, repositoryInfoState])

  return (
    <>
      {userInfo?.avatar.url && (
        <img
          className="avatar-size rounded-full"
          src={userInfo?.avatar.url}
          alt=""
        />
      )}
      {!userInfo && (
        <span className="avatar-size rounded-full bg-neutral-300" />
      )}
    </>
  )
}

export default Avatar
