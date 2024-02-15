import OpenAI from 'openai'
import { filterSchema, printSchemaWithDirectives } from '@graphql-tools/utils'
import {
  GraphQLFieldConfig,
  GraphQLSchema,
  GraphQLType,
  isNamedType,
  isWrappingType,
} from 'graphql/type'
import {
  GraphQLField,
  GraphQLObjectType,
  isInputObjectType,
} from 'graphql/type/definition'
import {
  getFieldDirectiveArgumentStringValue,
  getNamedTypeFromWrappingType,
} from './schema-utils'
import { AiProgressHandler } from '../context/EditorProvider'

export async function processAiInstruction(
  openAiToken: string,
  schema: GraphQLSchema,
  targetType: GraphQLObjectType | null,
  field: GraphQLField<any, any> | null,
  entireEntryData: Record<string, unknown>,
  dataToEdit: any,
  instruction: string,
  progressHandler: AiProgressHandler,
  abortSignal: AbortSignal,
): Promise<Record<string, any>> {
  if (!!targetType === !!field) {
    throw new Error('Only either a type or a field may be provided')
  }

  const openai = new OpenAI({
    apiKey: openAiToken,
    dangerouslyAllowBrowser: true,
  })

  const filteredSchema = filterSchema({
    schema: schema,
    typeFilter: (typeName: string, type: GraphQLType): boolean => {
      return !isInputObjectType(type)
    },
    rootFieldFilter: (
      operation: 'Query' | 'Mutation' | 'Subscription',
      rootFieldName: string,
      fieldConfig: GraphQLFieldConfig<any, any>,
    ): boolean => {
      return operation !== 'Mutation'
    },
  })

  const schemaString = printSchemaWithDirectives(filteredSchema)

  let serializedDataToEdit: string
  if (typeof dataToEdit === 'object' || Array.isArray(dataToEdit)) {
    serializedDataToEdit = JSON.stringify(dataToEdit)
  } else {
    serializedDataToEdit = dataToEdit.toString()
  }

  let serializedEntireEntryData: string | null = null
  if (field !== null) {
    serializedEntireEntryData = JSON.stringify(entireEntryData)
  }

  let fieldAiInstruction = null
  if (field !== null) {
    fieldAiInstruction = getFieldDirectiveArgumentStringValue(
      field,
      'Ai',
      'instruction',
    )
  }

  let typeName
  if (targetType !== null) {
    typeName = targetType.name
  } else if (field?.type) {
    const concreteType = isWrappingType(field?.type)
      ? getNamedTypeFromWrappingType(field?.type)
      : field?.type
    if (isNamedType(concreteType)) {
      typeName = concreteType.name
    } else {
      throw new Error('Expected named type')
    }
  }
  if (!typeName) {
    throw new Error('Cannot determine type name')
  }

  const systemInstruction =
    '[Output only JSON]\n' +
    '[Do not truncate output]\n' +
    'Consider this GraphQL schema:\n\n```\n' +
    schemaString +
    '\n```\n\n' +
    `The user instructions refer to GraphQL type "${typeName}".\n` +
    `Here is the existing data for type "${typeName}" that the instruction should be executed on:\n` +
    '\n```\n' +
    serializedDataToEdit +
    '\n```\n\n' +
    (serializedEntireEntryData
      ? `As the existing data is part of a larger data structure, for context only, here is a JSON encoded representation of this larger data structure:\n\`\`\`\n${serializedEntireEntryData}\n\`\`\`\n\nDo not include this contextual data in the output.\n\n`
      : '') +
    (fieldAiInstruction
      ? `Type "${typeName}" to use for output in this particular case has this "@Ai" instruction:\n\`\`\`\n${fieldAiInstruction}\n\`\`\`\n\n`
      : 'When generating the response, use the "instruction" argument of directive "@Ai(instruction)" where applied in the schema, to get type- and field-specific output instructions.\n') +
    `Return the response as JSON encoded data that would be valid for type "${typeName}" and do not return any other text.\n` +
    'Ensure that an additional field "__typename" is included where union types are generated.\n' +
    'The user instruction determines what the generated data should look like.\n' +
    'If a translation is requested, take the existing data and use it as a translation source.\n' +
    'Do not return any instructions or comments in the response.\n' +
    `Return the data within a field "data" and do not nest the data in an additional sub-field "${typeName}".\n` +
    ''

  const chatCompletionStream = await openai.chat.completions.create(
    {
      messages: [
        {
          role: 'system',
          content: systemInstruction,
        },
        { role: 'user', content: instruction },
      ],
      model: 'gpt-4-0613',
      max_tokens: 4 * 1024,
      stream: true,
    },
    { signal: abortSignal },
  )

  let response = ''
  for await (const chunk of chatCompletionStream) {
    response += chunk.choices[0]?.delta?.content || ''
    progressHandler(response.length)
  }

  if (abortSignal.aborted) {
    return {}
  }

  if (response.startsWith('```json')) {
    return JSON.parse(response.slice(7, -3))
  }
  if (response.startsWith('```')) {
    return JSON.parse(response.slice(3, -3))
  }

  return JSON.parse(response !== '' ? response : '{}')
}
