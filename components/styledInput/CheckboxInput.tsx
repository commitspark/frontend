import React from 'react'

interface CheckboxInputProps {
  id?: string
  name?: string
  disabled?: boolean
  prefix?: string
  value: boolean
  handleDataChangeEvent: (newValue: boolean) => void
}

const CheckboxInput: React.FC<React.PropsWithChildren<CheckboxInputProps>> = (
  props: React.PropsWithChildren<CheckboxInputProps>,
) => {
  return (
    <div className="flex flex-row gap-3">
      <input
        id={props.id}
        name={props.name}
        type="checkbox"
        className={
          'self-center form-input-cursor form-input-background form-input-ring rounded'
        }
        checked={props.value}
        onChange={(event) =>
          props.handleDataChangeEvent(event.currentTarget.checked)
        }
        disabled={props.disabled}
      />
      <label htmlFor={props.name} className={'form-input-label'}>
        {props.name}
      </label>
    </div>
  )
}

export default CheckboxInput
