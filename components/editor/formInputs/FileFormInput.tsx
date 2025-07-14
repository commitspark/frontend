import React from 'react'
import { GraphQLScalarType } from 'graphql/type'
import FileInput from '@/components/styledInput/FileInput'

interface SingleLineTextFormInputProps {
  fieldName: string
  fieldType: GraphQLScalarType
  handleChildDataChangeRequest: (fieldName: string, newFieldValue: any) => void
  value: File | null
  readOnly?: boolean
}

const SingleLineTextFormInput: React.FC<SingleLineTextFormInputProps> = (
  props: SingleLineTextFormInputProps,
) => {
  return (
    <FileInput
      id={props.fieldName}
      name={props.fieldName}
      disabled={props.readOnly}
      value={props.value}
      handleDataChangeEvent={(newValue) => {
        props.handleChildDataChangeRequest(props.fieldName, newValue)
      }}
    />
  )
}

export default SingleLineTextFormInput
