import React from 'react'

interface TextInputProps {
  id?: string
  name?: string
  disabled?: boolean
  value: string
  placeholder?: string
  handleDataChangeEvent: (newValue: string) => void
}

const TextInput: React.FC<TextInputProps> = (props: TextInputProps) => {
  return (
    <div className={'w-full form-input-ring form-input-background'}>
      <input
        id={props.id}
        name={props.name}
        type="text"
        autoComplete="off"
        className={
          'w-full border-0 bg-transparent form-input-padding focus:ring-0 form-input-text form-input-cursor'
        }
        value={props.value}
        onChange={(event) =>
          props.handleDataChangeEvent(event.currentTarget.value)
        }
        disabled={!!props.disabled}
        placeholder={props.placeholder}
      />
    </div>
  )
}

export default TextInput
