import React from 'react'
import AddNamedTypeListEntryButton from '../form/AddNamedTypeListEntryButton'
import { createDefaultData } from '../../lib/default-data-generator'
import { GraphQLScalarType } from 'graphql/type'
import CheckboxInput from '../../styledInput/CheckboxInput'

interface BooleanFormInputProps {
  fieldName: string
  fieldType: GraphQLScalarType
  handleChildDataChangeRequest: (fieldName: string, newFieldValue: any) => void
  value: boolean | null
  readOnly?: boolean
}

const BooleanFormInput: React.FC<BooleanFormInputProps> = (
  props: BooleanFormInputProps,
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
    <CheckboxInput
      name={props.fieldName}
      value={props.value}
      disabled={props.readOnly}
      handleDataChangeEvent={(newValue: boolean) =>
        props.handleChildDataChangeRequest(props.fieldName, newValue)
      }
    />
  )
}

export default BooleanFormInput
