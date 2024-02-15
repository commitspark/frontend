import React from 'react'
import { GraphQLObjectType } from 'graphql/type'
import AddNamedTypeListEntryButton from './AddNamedTypeListEntryButton'
import { createDefaultData } from '../../lib/default-data-generator'
import ReferencePickerFormInput from '../formInputs/ReferencePickerFormInput'

interface ReferencePickerProps {
  fieldType: GraphQLObjectType
  fieldName: string
  isRequiredField: boolean
  data: Record<string, unknown> | null
  handleChildDataChangeRequest: (childName: string, childData: unknown) => void
}

const ReferencePicker: React.FC<ReferencePickerProps> = (
  props: ReferencePickerProps,
) => {
  if (props.data === null) {
    return (
      <AddNamedTypeListEntryButton
        typeNameLabel={`${props.fieldType.name} reference`}
        handleAddButtonEvent={() => {
          const defaultData = createDefaultData(props.fieldType, 1)
          props.handleChildDataChangeRequest(props.fieldName, defaultData)
        }}
      />
    )
  }

  return (
    <ReferencePickerFormInput
      objectType={props.fieldType}
      fieldName={props.fieldName}
      isRequired={props.isRequiredField}
      data={props.data}
      handleChildDataChangeRequest={props.handleChildDataChangeRequest}
    />
  )
}

export default ReferencePicker
