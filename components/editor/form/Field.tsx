import React, { memo } from 'react'
import {
  GraphQLType,
  isListType,
  isNamedType,
  isNonNullType,
  isUnionType,
} from 'graphql/type'
import { GraphQLField } from 'graphql/type/definition'
import {
  assertIsArrayOrNull,
  assertIsRecordOrNull,
  assertIsString,
} from '../../lib/assert'
import NamedType from './NamedType'
import ListType from './ListType'
import FieldLabel from './FieldLabel'
import { getNamedTypeFromWrappingType } from '../../lib/schema-utils'
import { deepEqual } from '../../lib/content-utils'

interface FieldProps {
  fieldType: GraphQLType
  fieldName: string
  field: GraphQLField<any, any>
  isRequiredField: boolean
  data: unknown
  handleChildDataChangeRequest: (childName: string, childData: unknown) => void
}

const Field: React.FC<FieldProps> = memo<FieldProps>(
  (props: FieldProps) => {
    let typeInstance
    let typeNameLabel = ''
    if (isNonNullType(props.fieldType)) {
      return (
        <Field
          fieldType={props.fieldType.ofType}
          fieldName={props.fieldName}
          field={props.field}
          isRequiredField={true}
          data={props.data}
          handleChildDataChangeRequest={props.handleChildDataChangeRequest}
        />
      )
    } else if (isListType(props.fieldType)) {
      assertIsArrayOrNull(props.data)
      typeInstance = (
        <ListType
          fieldType={props.fieldType}
          fieldName={props.fieldName}
          field={props.field}
          isRequiredField={props.isRequiredField}
          data={props.data}
          handleChildDataChangeRequest={props.handleChildDataChangeRequest}
        />
      )
      typeNameLabel = `${
        getNamedTypeFromWrappingType(props.fieldType).name
      } list`
    } else if (isNamedType(props.fieldType)) {
      typeInstance = (
        <NamedType
          fieldType={props.fieldType}
          fieldName={props.fieldName}
          field={props.field}
          isRequiredField={props.isRequiredField}
          data={props.data}
          handleChildDataChangeRequest={props.handleChildDataChangeRequest}
        />
      )

      typeNameLabel = props.fieldType.name
      if (isUnionType(props.fieldType)) {
        assertIsRecordOrNull(props.data)
        if (props.data !== null) {
          const concreteUnionTypeName = props.data['__typename']
          assertIsString(concreteUnionTypeName)
          typeNameLabel = concreteUnionTypeName
          const concreteFieldTypeInstance = props.fieldType
            .getTypes()
            .find((objectType) => objectType.name === concreteUnionTypeName)
          if (!concreteFieldTypeInstance) {
            throw new Error(`Unexpected union type "${concreteUnionTypeName}".`)
          }
        }
      }
    } else {
      throw new Error(`Unknown field type for field "${props.field.name}"`)
    }

    return (
      <FieldLabel
        fieldName={props.fieldName}
        typeNameLabel={typeNameLabel}
        isRequiredField={props.isRequiredField}
        offerRemoveAction={!props.isRequiredField && props.data !== null}
        removeEventHandler={() => {
          props.handleChildDataChangeRequest(props.fieldName, null)
        }}
      >
        {typeInstance}
      </FieldLabel>
    )
  },
  (prevProps, nextProps) => deepEqual(prevProps.data, nextProps.data),
)

Field.displayName = 'Field'

export default Field
