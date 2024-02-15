import React from 'react'
import { GraphQLField, GraphQLUnionType } from 'graphql/type/definition'
import AddUnionTypeListEntryDropdown from './AddUnionTypeListEntryDropdown'
import { GraphQLObjectType } from 'graphql/type'
import { createDefaultData } from '../../lib/default-data-generator'
import { assertIsRecordOrNull, assertIsString } from '../../lib/assert'
import NamedType from './NamedType'

interface UnionProps {
  fieldType: GraphQLUnionType
  fieldName: string
  field: GraphQLField<any, any>
  isRequiredField: boolean
  data: Record<string, unknown> | null
  handleChildDataChangeRequest: (childName: string, childData: unknown) => void
}

const Union: React.FC<UnionProps> = (props: UnionProps) => {
  if (props.data === null) {
    return (
      <AddUnionTypeListEntryDropdown
        unionType={props.fieldType}
        handleAddButtonEvent={(fieldTypeToAdd: GraphQLObjectType) => {
          const defaultData = createDefaultData(fieldTypeToAdd, 1)
          assertIsRecordOrNull(defaultData)
          props.handleChildDataChangeRequest(props.fieldName, {
            ...defaultData,
            __typename: fieldTypeToAdd.name,
          })
        }}
      />
    )
  }

  // determine the concrete type that our data is based upon
  const typeName = props.data['__typename']
  assertIsString(typeName)
  const concreteType = props.fieldType
    .getTypes()
    .find((concreteType) => concreteType.name === typeName)
  if (!concreteType) {
    throw new Error(
      `Type "${typeName}" is not a member of union type "${props.fieldType.name}".`,
    )
  }

  return (
    <NamedType
      fieldType={concreteType}
      fieldName={props.fieldName}
      field={props.field}
      isRequiredField={props.isRequiredField}
      data={props.data}
      handleChildDataChangeRequest={props.handleChildDataChangeRequest}
    />
  )
}

export default Union
