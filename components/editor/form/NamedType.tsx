import React from 'react'
import { GraphQLField, GraphQLNamedType } from 'graphql/type/definition'
import {
  isEnumType,
  isObjectType,
  isScalarType,
  isUnionType,
} from 'graphql/type'
import { getDirectiveByName } from '../../lib/schema-utils'
import { assertIsRecordOrNull, assertIsStringOrNull } from '../../lib/assert'
import ScalarType from './ScalarType'
import ReferencePicker from './ReferencePicker'
import Enum from './Enum'
import Union from './Union'
import UserDefinedObjectType from './UserDefinedObjectType'

interface NamedTypeProps {
  fieldType: GraphQLNamedType
  fieldName: string
  field: GraphQLField<any, any>
  isRequiredField: boolean
  data: unknown
  handleChildDataChangeRequest: (childName: string, childData: unknown) => void
}

const NamedType: React.FC<NamedTypeProps> = (props: NamedTypeProps) => {
  if (isScalarType(props.fieldType)) {
    return (
      <ScalarType
        fieldType={props.fieldType}
        fieldName={props.fieldName}
        field={props.field}
        isRequiredField={props.isRequiredField}
        data={props.data}
        handleChildDataChangeRequest={props.handleChildDataChangeRequest}
      />
    )
  }

  // non-native types follow

  if (
    isObjectType(props.fieldType) &&
    getDirectiveByName(props.fieldType, 'Entry')
  ) {
    assertIsRecordOrNull(props.data)
    return (
      <ReferencePicker
        fieldType={props.fieldType}
        fieldName={props.fieldName}
        isRequiredField={props.isRequiredField}
        data={props.data}
        handleChildDataChangeRequest={props.handleChildDataChangeRequest}
      />
    )
  }

  if (isEnumType(props.fieldType)) {
    assertIsStringOrNull(props.data)
    return (
      <Enum
        fieldType={props.fieldType}
        fieldName={props.fieldName}
        isRequiredField={props.isRequiredField}
        data={props.data}
        handleChildDataChangeRequest={props.handleChildDataChangeRequest}
      />
    )
  }

  if (isUnionType(props.fieldType)) {
    assertIsRecordOrNull(props.data)
    return (
      <Union
        fieldType={props.fieldType}
        fieldName={props.fieldName}
        field={props.field}
        isRequiredField={props.isRequiredField}
        data={props.data}
        handleChildDataChangeRequest={props.handleChildDataChangeRequest}
      />
    )
  }

  if (!isObjectType(props.fieldType)) {
    throw new Error(
      `Expected GraphQLObjectType for type "${props.fieldType.name}".`,
    )
  }

  // nested form for user-defined content type
  assertIsRecordOrNull(props.data)
  return (
    <UserDefinedObjectType
      fieldType={props.fieldType}
      fieldName={props.fieldName}
      isRequiredField={props.isRequiredField}
      data={props.data}
      handleChildDataChangeRequest={props.handleChildDataChangeRequest}
    />
  )
}

export default NamedType
