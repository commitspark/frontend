import React from 'react'
import { GraphQLScalarType } from 'graphql'
import FileInput from '@/components/styledInput/FileInput'

interface FileFormInputProps {
  fieldName: string
  fieldType: GraphQLScalarType
  handleChildDataChangeRequest: (fieldName: string, newFieldValue: any) => void
  value: File | null
  readOnly?: boolean
}

const FileFormInput: React.FC<FileFormInputProps> = (
  props: FileFormInputProps,
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

export default FileFormInput
