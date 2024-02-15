'use client'

import React, { useEffect, useState } from 'react'
import {
  RepositoryInfoState,
  useRepositoryInfo,
} from '../context/RepositoryInfoProvider'
import { getCookie } from 'cookies-next'
import { COOKIE_PROVIDER_TOKEN_GITHUB } from '../../lib/cookies'
import { Octokit } from 'octokit'

interface AvatarProps {}

interface UserInfoState {
  avatarUrl: string
  username: string
}

const Avatar: React.FC<React.PropsWithChildren<AvatarProps>> = (
  props: React.PropsWithChildren<AvatarProps>,
) => {
  const repositoryInfoState = useRepositoryInfo() as RepositoryInfoState
  const token = `${getCookie(COOKIE_PROVIDER_TOKEN_GITHUB)}`

  const [userInfo, setUserInfo] = useState<UserInfoState | null>(null)

  useEffect(() => {
    async function fetchUserInfo() {
      setUserInfo(null)
      const octokit = new Octokit({ auth: token })
      const response = await octokit.request('GET /user')
      if (!ignore) {
        setUserInfo({
          avatarUrl: response.data.avatar_url,
          username: response.data.login,
        })
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
      {userInfo?.avatarUrl && (
        <img
          className="avatar-size rounded-full"
          src={userInfo?.avatarUrl}
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
