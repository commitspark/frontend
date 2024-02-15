import React from 'react'
import AddNamedTypeListEntryButton from '../form/AddNamedTypeListEntryButton'
import { createDefaultData } from '../../lib/default-data-generator'
import { GraphQLScalarType } from 'graphql/type'
import NumberInput, { NumberType } from '../../styledInput/NumberInput'

interface NumberFormInputProps {
  fieldName: string
  fieldType: GraphQLScalarType
  handleChildDataChangeRequest: (fieldName: string, newFieldValue: any) => void
  value: number | null
  readOnly?: boolean
  numberType?: NumberType
}

const NumberFormInput: React.FC<
  React.PropsWithChildren<NumberFormInputProps>
> = (props: React.PropsWithChildren<NumberFormInputProps>) => {
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
    <NumberInput
      name={props.fieldName}
      numberType={props.numberType ?? NumberType.Integer}
      value={props.value}
      handleDataChangeEvent={(newValue: number) =>
        props.handleChildDataChangeRequest(props.fieldName, newValue)
      }
    />
  )
}

export default NumberFormInput
