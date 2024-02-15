import React from 'react'
import AddNamedTypeListEntryButton from '../form/AddNamedTypeListEntryButton'
import { createDefaultData } from '../../lib/default-data-generator'
import { GraphQLScalarType } from 'graphql/type'
import TextareaInput, {
  FontClassification,
} from '../../styledInput/TextareaInput'

interface MultiLineTextFormInputProps {
  fieldName: string
  fieldType: GraphQLScalarType
  handleChildDataChangeRequest: (fieldName: string, newFieldValue: any) => void
  value: string | null
  readOnly?: boolean
  fontClassification?: FontClassification
}

const MultiLineTextFormInput: React.FC<MultiLineTextFormInputProps> = (
  props: MultiLineTextFormInputProps,
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
    <TextareaInput
      name={props.fieldName}
      value={props.value}
      disabled={props.readOnly}
      handleDataChangeEvent={(newValue: string) => {
        props.handleChildDataChangeRequest(props.fieldName, newValue)
      }}
      fontClassification={props.fontClassification}
    />
  )
}

export default MultiLineTextFormInput
