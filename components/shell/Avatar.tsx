'use client'

import React, { useEffect, useState } from 'react'
import { User } from '../../lib/provider/provider'
import { commitsparkConfig } from '../../commitspark.config'
import { fetchUserInfo } from '../../app/server-actions/actions'

interface AvatarProps {}

const Avatar: React.FC<React.PropsWithChildren<AvatarProps>> = (
  props: React.PropsWithChildren<AvatarProps>,
) => {
  const [userInfo, setUserInfo] = useState<User | null>(null)

  useEffect(() => {
    const updateUserInfo = async () => {
      const token = await commitsparkConfig.createAuthenticator().getToken()
      const user = await fetchUserInfo(token)
      setUserInfo(user)
    }

    updateUserInfo()

    return () => {}
  }, [])

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
