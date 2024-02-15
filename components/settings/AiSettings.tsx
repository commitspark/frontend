'use client'

import React, { useEffect, useState } from 'react'
import { STORAGE_TOKEN_OPEN_AI } from '../../lib/localStorage'
import Setting from './Setting'
import { classNames } from '../lib/styling'

interface AiSettingsProps {
  className?: string
}

const AiSettings: React.FC<React.PropsWithChildren<AiSettingsProps>> = (
  props: React.PropsWithChildren<AiSettingsProps>,
) => {
  const [openAiToken, setOpenAiToken] = useState<string | null>(null)
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_TOKEN_OPEN_AI)
    if (token) {
      setOpenAiToken(token)
    }
  }, [])

  return (
    <main className={classNames('', props.className)}>
      <Setting
        isSecret={true}
        label={'OpenAI API Key'}
        value={openAiToken}
        onSave={(newValue: string) => {
          if (newValue === '') {
            localStorage.removeItem(STORAGE_TOKEN_OPEN_AI)
            setOpenAiToken(null)
          } else {
            localStorage.setItem(STORAGE_TOKEN_OPEN_AI, newValue)
            setOpenAiToken(newValue)
          }
        }}
        placeholder={'sk-...'}
        helpText={'This key is saved in your browser only.'}
      />
    </main>
  )
}

export default AiSettings
