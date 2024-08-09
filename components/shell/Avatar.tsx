'use client'

import React, { useEffect, useState } from 'react'
import {
  RepositoryInfoState,
  useRepositoryInfo,
} from '../context/RepositoryInfoProvider'
import { User } from '../../lib/provider/provider'
import { commitsparkConfig } from '../../commitspark.config'

interface AvatarProps {}

const Avatar: React.FC<React.PropsWithChildren<AvatarProps>> = (
  props: React.PropsWithChildren<AvatarProps>,
) => {
  const repositoryInfoState = useRepositoryInfo() as RepositoryInfoState

  const [userInfo, setUserInfo] = useState<User | null>(null)

  useEffect(() => {
    async function fetchUserInfo() {
      setUserInfo(null)
      const token = await commitsparkConfig.createAuthenticator().getToken()
      const provider = commitsparkConfig.createProvider()
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
  }, [repositoryInfoState])

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
