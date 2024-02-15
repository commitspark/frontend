import React from 'react'

interface SelectInputProps {
  id?: string
  name?: string
  disabled?: boolean
  prefix?: string
  defaultValue?: string
  options: string[]
  handleDataChangeEvent: (newValue: string) => void
}

const SelectInput: React.FC<SelectInputProps> = (props: SelectInputProps) => {
  return (
    <select
      id={props.id}
      name={props.name}
      className={
        'w-full form-input-padding pr-8 form-input-text form-input-cursor form-input-background form-input-ring'
      }
      defaultValue={props.defaultValue ?? ''}
      onChange={(event) =>
        props.handleDataChangeEvent(event.currentTarget.value)
      }
      disabled={!!props.disabled}
    >
      {props.options.map((option, index) => (
        <option key={index}>{option}</option>
      ))}
    </select>
  )
}

export default SelectInput
