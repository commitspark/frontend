import React from 'react'
import { GraphQLEnumType } from 'graphql/type/definition'
import AddNamedTypeListEntryButton from './AddNamedTypeListEntryButton'
import SelectFormInput from '../formInputs/SelectFormInput'
import { createDefaultData } from '../../lib/default-data-generator'

interface EnumProps {
  fieldType: GraphQLEnumType
  fieldName: string
  isRequiredField: boolean
  data: string | null
  handleChildDataChangeRequest: (childName: string, childData: unknown) => void
}

const Enum: React.FC<EnumProps> = (props: EnumProps) => {
  let selectedValue = null
  const values = props.fieldType.getValues().map((value) => {
    if (props.data === value.name) {
      selectedValue = value.name
    }
    return value.name
  })

  if (props.data === null) {
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
    <SelectFormInput
      fieldName={props.fieldName}
      isRequired={props.isRequiredField}
      options={values ?? []}
      defaultValue={selectedValue}
      handleChildDataChangeRequest={props.handleChildDataChangeRequest}
    />
  )
}

export default Enum
