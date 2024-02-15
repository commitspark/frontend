import React from 'react'

export enum NumberType {
  Integer,
  Float,
}

interface NumberInputProps {
  id?: string
  name?: string
  disabled?: boolean
  prefix?: string
  numberType: NumberType
  value: number
  handleDataChangeEvent: (newValue: number) => void
}

const NumberInput: React.FC<React.PropsWithChildren<NumberInputProps>> = (
  props: React.PropsWithChildren<NumberInputProps>,
) => {
  return (
    <div>
      <input
        id={props.id}
        name={props.name}
        type="number"
        autoComplete="off"
        className={
          'w-full form-input-padding form-input-text form-input-cursor form-input-background form-input-ring'
        }
        step={props?.numberType === NumberType.Float ? 'any' : 1}
        value={props.value}
        onChange={(event) => {
          const eventValue = event.currentTarget.value
          // we ignore empty value
          if (eventValue !== '') {
            // we ignore invalid values, e.g. after typing a float decimal point and before the succeeding digit
            try {
              const newValue =
                props.numberType === NumberType.Integer
                  ? Number.parseInt(eventValue)
                  : parseFloat(eventValue)
              props.handleDataChangeEvent(newValue)
            } catch (_) {}
          }
        }}
        disabled={props.disabled}
      />
    </div>
  )
}

export default NumberInput
