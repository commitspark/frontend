import React from 'react'
import AddNamedTypeListEntryButton from '../form/AddNamedTypeListEntryButton'
import { createDefaultData } from '../../lib/default-data-generator'
import { GraphQLScalarType } from 'graphql/type'
import TextInput from '../../styledInput/TextInput'

interface SingleLineTextFormInputProps {
  fieldName: string
  fieldType: GraphQLScalarType
  handleChildDataChangeRequest: (fieldName: string, newFieldValue: any) => void
  value: string | null
  readOnly?: boolean
}

const SingleLineTextFormInput: React.FC<SingleLineTextFormInputProps> = (
  props: SingleLineTextFormInputProps,
) => {
  if (props.value === null) {
    return (
      <AddNamedTypeListEntryButton
        typeNameLabel={props.fieldType.name}
        handleAddButtonEvent={() => {
          const defaultData = createDefaultData(props.fieldType, 1)
          props.handleChildDataChangeRequest(props.fieldName, defaultData)
        }}
      />
    )
  }

  return (
    <TextInput
      id={props.fieldName}
      name={props.fieldName}
      disabled={props.readOnly}
      value={props.value}
      handleDataChangeEvent={(newValue: string) => {
        props.handleChildDataChangeRequest(props.fieldName, newValue)
      }}
    />
  )
}

export default SingleLineTextFormInput
