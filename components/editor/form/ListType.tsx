import React from 'react'
import { GraphQLField, GraphQLList } from 'graphql/type/definition'
import { GraphQLType } from 'graphql/type'
import { getNamedTypeFromWrappingType } from '../../lib/schema-utils'
import AddNamedTypeListEntryButton from './AddNamedTypeListEntryButton'
import { createDefaultData } from '../../lib/default-data-generator'
import EditableListFormInput from '../formInputs/EditableListFormInput'

interface ListTypeProps {
  fieldType: GraphQLList<GraphQLType>
  fieldName: string
  field: GraphQLField<any, any>
  isRequiredField: boolean
  data: unknown[] | null
  handleChildDataChangeRequest: (childName: string, childData: unknown) => void
}

const ListType: React.FC<ListTypeProps> = (props: ListTypeProps) => {
  const childNamedType = getNamedTypeFromWrappingType(props.fieldType)

  if (props.data === null) {
    return (
      <AddNamedTypeListEntryButton
        typeNameLabel={`${childNamedType.name} list`}
        handleAddButtonEvent={() => {
          const defaultData = createDefaultData(props.fieldType, 1)
          props.handleChildDataChangeRequest(props.fieldName, defaultData)
        }}
      />
    )
  }

  return (
    <EditableListFormInput
      fieldType={props.fieldType}
      fieldName={props.fieldName}
      field={props.field}
      data={props.data}
      handleChildDataChangeRequest={props.handleChildDataChangeRequest}
    />
  )
}

export default ListType
