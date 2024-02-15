import React, { memo, useEffect } from 'react'
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
import {
  getDirectiveByName,
  getNamedTypeFromWrappingType,
} from '../../lib/schema-utils'
import {
  AiInstructionHandler,
  AiProgressHandler,
  EditorContextValue,
  useEditor,
} from '../../context/EditorProvider'
import { processAiInstruction } from '../../lib/ai'
import { STORAGE_TOKEN_OPEN_AI } from '../../../lib/localStorage'
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
    const editorContext = useEditor() as EditorContextValue
    const openAiToken: string =
      localStorage.getItem(STORAGE_TOKEN_OPEN_AI) ?? ''

    let typeInstance
    let typeNameLabel = ''
    let concreteFieldType: GraphQLType = props.field.type

    let aiAbortController: AbortController | null = null
    useEffect(() => {
      return () => {
        if (aiAbortController) {
          aiAbortController.abort()
        }
      }
    }, [aiAbortController])

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
          concreteFieldType = concreteFieldTypeInstance
        }
      }
    } else {
      throw new Error(`Unknown field type for field "${props.field.name}"`)
    }

    const offerAiAssist =
      editorContext.isAiEnabled &&
      isNamedType(props.fieldType) &&
      !getDirectiveByName(props.fieldType, 'Entry') &&
      props.fieldName !== 'id' // TODO generalize to not offer AI Assist for any disabled form field

    const aiInstructionHandler: AiInstructionHandler = async (
      instruction: string,
      aiProgressHandler: AiProgressHandler,
    ) => {
      if (!aiAbortController) {
        throw new Error('Expected AbortController instance')
      }

      const responseData = await processAiInstruction(
        openAiToken,
        editorContext.schema.current,
        null,
        props.field,
        editorContext.entryData.current,
        props.data,
        instruction,
        aiProgressHandler,
        aiAbortController.signal,
      )
      // console.log(responseData)
      if (aiAbortController.signal.aborted) {
        return
      }

      if (isUnionType(props.fieldType) && isNamedType(concreteFieldType)) {
        // ensure that type information remains when writing back the AI response
        props.handleChildDataChangeRequest(props.fieldName, {
          ...responseData.data,
          __typename: concreteFieldType.name,
        })
      } else {
        props.handleChildDataChangeRequest(props.fieldName, responseData.data)
      }

      editorContext.closeAiModal()
    }

    const aiEventHandler = offerAiAssist
      ? () => {
          aiAbortController = new AbortController()
          editorContext.openAiModal(aiInstructionHandler, aiAbortController)
        }
      : null

    return (
      <FieldLabel
        fieldName={props.fieldName}
        typeNameLabel={typeNameLabel}
        isRequiredField={props.isRequiredField}
        offerRemoveAction={!props.isRequiredField && props.data !== null}
        removeEventHandler={() => {
          props.handleChildDataChangeRequest(props.fieldName, null)
        }}
        aiEventHandler={aiEventHandler}
      >
        {typeInstance}
      </FieldLabel>
    )
  },
  (prevProps, nextProps) => deepEqual(prevProps.data, nextProps.data),
)

Field.displayName = 'Field'

export default Field
