import React from 'react'
import { getFieldDirectiveArgumentStringValue } from '../../lib/schema-utils'
import {
  assertIsBooleanOrNull,
  assertIsFloatOrNull,
  assertIsNumberOrNull,
  assertIsStringOrNull,
} from '../../lib/assert'
import { GraphQLField } from 'graphql/type/definition'
import { GraphQLScalarType } from 'graphql/type'
import MultiLineTextFormInput from '../formInputs/MultiLineTextFormInput'
import MarkdownFormInput from '../formInputs/MarkdownFormInput'
import SingleLineTextFormInput from '../formInputs/SingleLineTextFormInput'
import NumberFormInput from '../formInputs/NumberFormInput'
import BooleanFormInput from '../formInputs/BooleanFormInput'
import { NumberType } from '../../styledInput/NumberInput'

interface ScalarTypeProps {
  fieldType: GraphQLScalarType
  fieldName: string
  field: GraphQLField<any, any>
  isRequiredField: boolean
  data: unknown
  handleChildDataChangeRequest: (childName: string, childData: unknown) => void
}

const ScalarType: React.FC<ScalarTypeProps> = (props: ScalarTypeProps) => {
  const fieldTypeName = props.fieldType.name

  const customEditorName = getFieldDirectiveArgumentStringValue(
    props.field,
    'Ui',
    'editor',
  )
  if (customEditorName) {
    const customEditor = getEditorByName(
      customEditorName,
      props.fieldType,
      props.fieldName,
      props.field,
      props.data,
      props.handleChildDataChangeRequest,
    )
    // if we don't have a custom editor for a name, use a standard editor below
    if (customEditor) {
      return customEditor
    }
    console.warn(`Unknown field editor "${customEditorName}"`)
  }

  if (fieldTypeName === 'ID') {
    assertIsStringOrNull(props.data)
    return (
      <SingleLineTextFormInput
        fieldName={props.fieldName}
        fieldType={props.fieldType}
        handleChildDataChangeRequest={props.handleChildDataChangeRequest}
        value={props.data}
        readOnly={true}
      />
    )
  } else if (fieldTypeName === 'String') {
    assertIsStringOrNull(props.data)
    return (
      <SingleLineTextFormInput
        fieldName={props.fieldName}
        fieldType={props.fieldType}
        handleChildDataChangeRequest={props.handleChildDataChangeRequest}
        value={props.data}
      />
    )
  } else if (fieldTypeName === 'Int') {
    assertIsNumberOrNull(props.data)
    return (
      <NumberFormInput
        fieldName={props.fieldName}
        fieldType={props.fieldType}
        numberType={NumberType.Integer}
        value={props.data}
        handleChildDataChangeRequest={props.handleChildDataChangeRequest}
      />
    )
  } else if (fieldTypeName === 'Boolean') {
    assertIsBooleanOrNull(props.data)
    return (
      <BooleanFormInput
        fieldName={props.fieldName}
        fieldType={props.fieldType}
        value={props.data}
        handleChildDataChangeRequest={props.handleChildDataChangeRequest}
      />
    )
  } else if (fieldTypeName === 'Float') {
    assertIsFloatOrNull(props.data)
    return (
      <NumberFormInput
        fieldName={props.fieldName}
        fieldType={props.fieldType}
        numberType={NumberType.Float}
        value={props.data}
        handleChildDataChangeRequest={props.handleChildDataChangeRequest}
      />
    )
  }

  throw new Error('Unexpected ScalarType')
}

function getEditorByName(
  editorName: string,
  fieldType: GraphQLScalarType,
  fieldName: string,
  field: GraphQLField<any, any>,
  data: unknown,
  handleChildDataChangeRequest: (childName: string, childData: unknown) => void,
): React.ReactElement | null {
  if (editorName === 'multiline') {
    assertIsStringOrNull(data)
    return (
      <MultiLineTextFormInput
        value={data}
        handleChildDataChangeRequest={handleChildDataChangeRequest}
        fieldName={fieldName}
        fieldType={fieldType}
      />
    )
  }
  if (editorName === 'markdown') {
    assertIsStringOrNull(data)
    return (
      <MarkdownFormInput
        value={data}
        handleChildDataChangeRequest={handleChildDataChangeRequest}
        fieldName={fieldName}
        fieldType={fieldType}
      />
    )
  }

  return null
}

export default ScalarType
