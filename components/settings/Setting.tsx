import React, { useState } from 'react'
import TextInput from '../styledInput/TextInput'
import StyledButton from '../StyledButton'
import { Actions, Size } from '../StyledButtonEnums'

interface SettingProps {
  label: string
  value: string | null
  isSecret?: boolean
  onSave: (newValue: string) => void
  placeholder?: string
  helpText?: string
}

const Setting: React.FC<React.PropsWithChildren<SettingProps>> = (
  props: React.PropsWithChildren<SettingProps>,
) => {
  const [newValue, setNewValue] = useState<string>('')
  const displayValue = props.isSecret
    ? props.value !== null && props.value !== ''
      ? '•••••••••••••••••' + props.value.slice(-4)
      : 'Not set'
    : props.value
  const [showForm, setShowForm] = useState<boolean>(false)

  return (
    <div className={'flex flex-col gap-y-2'}>
      <div className={'flex flex-row gap-x-4'}>
        <dt className="grid grid-cols-1 content-center">{props.label}</dt>
        <dd className="flex-grow flex">
          {!showForm && (
            <div className={'flex-grow flex flex-row gap-x-4'}>
              <div className="flex-grow grid grid-cols-1 content-center h-9">
                {displayValue}
              </div>
              <StyledButton
                actionType={Actions.primary}
                size={Size.md}
                onClick={(event) => {
                  event.preventDefault()
                  setShowForm(true)
                  if (!props.isSecret && props.value !== null) {
                    setNewValue(props.value)
                  }
                }}
              >
                Update
              </StyledButton>
            </div>
          )}
          {showForm && (
            <>
              <div className={'flex-grow flex flex-row gap-x-4'}>
                <TextInput
                  value={newValue}
                  handleDataChangeEvent={(val: string) => {
                    setNewValue(val)
                  }}
                  placeholder={props.placeholder}
                />
                {props.isSecret && (
                  <StyledButton
                    actionType={Actions.neutral}
                    size={Size.md}
                    onClick={() => {
                      setShowForm(false)
                    }}
                  >
                    Cancel
                  </StyledButton>
                )}
                <StyledButton
                  actionType={Actions.primary}
                  size={Size.md}
                  onClick={() => {
                    setShowForm(false)
                    props.onSave(newValue)
                    if (props.isSecret) {
                      setNewValue('')
                    }
                  }}
                >
                  Save
                </StyledButton>
              </div>
            </>
          )}
        </dd>
      </div>
      {showForm && props.helpText && (
        <p className={'text-sm leading-relaxed text-color-light'}>
          {props.helpText}
        </p>
      )}
    </div>
  )
}

export default Setting
