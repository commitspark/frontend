import React from 'react'
import SelectInput from '../../styledInput/SelectInput'

interface SelectFormInputProps {
  fieldName: string
  isRequired: boolean
  readOnly?: boolean
  options: string[]
  defaultValue: string | null
  handleChildDataChangeRequest: (fieldName: string, newFieldValue: any) => void
}

const SelectFormInput: React.FC<SelectFormInputProps> = (
  props: SelectFormInputProps,
) => {
  return (
    <SelectInput
      name={props.fieldName}
      options={props.options}
      disabled={props.readOnly}
      defaultValue={props.defaultValue ?? ''}
      handleDataChangeEvent={(newValue: string) =>
        props.handleChildDataChangeRequest(props.fieldName, newValue)
      }
    />
  )
}

export default SelectFormInput
