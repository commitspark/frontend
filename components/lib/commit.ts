'use server'

import 'server-only'
import { actionMutateEntry } from '@/app/server-actions/actions'
import {
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLSchema,
  isEnumType,
  isInputObjectType,
  isListType,
  isNamedType,
  isNonNullType,
  isScalarType,
} from 'graphql/type'
import { isOneOfInputType } from './schema-utils'
import { assertIsRecordOrNull, assertIsString } from './assert'
import { fetchSchemaString } from '@/components/lib/git-functions'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { GraphQLNamedType } from 'graphql/type/definition'

export async function commitEntry(
  session: string,
  owner: string,
  repository: string,
  ref: string,
  entryId: string | null,
  mutationType: 'create' | 'update',
  entryData: Record<string, unknown> | null,
  typeName: string,
  commitMessage: string,
): Promise<Record<string, unknown> | null> {
  if (commitMessage.length === 0) {
    throw new Error('Commit message must not be empty')
  }

  const schemaString = await fetchSchemaString(session, owner, repository, ref)

  const schema = makeExecutableSchema({
    typeDefs: schemaString,
  })
  const inputTypeName = `${typeName}Input`
  const inputType = schema.getType(inputTypeName)

  if (!isInputObjectType(inputType)) {
    throw new Error(
      `Expected GraphQLInputObjectType for type "${inputTypeName}".`,
    )
  }

  let cleanedData = entryData
  if (cleanedData !== null) {
    cleanedData = cleanDataByInputObjectType(schema, cleanedData, inputType)
  }

  const mutation = {
    query:
      `mutation ($entryId: ID!, $commitMessage: String!, $mutationData: ${typeName}Input!) {\n` +
      `data: ${mutationType}${typeName}(id: $entryId, commitMessage: $commitMessage, data: $mutationData) { id }\n` +
      '}',
    variables: {
      entryId: entryId,
      commitMessage: commitMessage,
      mutationData: cleanedData,
    },
  }

  const mutationResponseData = await actionMutateEntry(
    session,
    owner,
    repository,
    ref,
    mutation,
  )
  assertIsRecordOrNull(mutationResponseData?.data)
  return mutationResponseData.data
}

// returns `data` but recursively leaves out all fields that are either not defined in `inputObjectType` or are custom scalars
function cleanDataByInputObjectType(
  schema: GraphQLSchema,
  data: Record<string, unknown> | null,
  inputObjectType: GraphQLInputObjectType,
): Record<string, any> | null {
  if (data === null) {
    return null
  }

  // if we want to write a union that is not using @Entry-based concrete types, we use an intermediary field based
  // on the '@oneOf' directive to provide the concrete type to the backend
  // (see https://github.com/graphql/graphql-spec/pull/825)
  if (data && isOneOfInputType(inputObjectType)) {
    const concreteUnionTypeName = data['__typename'] // this is our internal UI helper field used for the same purpose
    assertIsString(concreteUnionTypeName)
    // search for field of same name as union type name
    const concreteUnionTypeField =
      inputObjectType.getFields()[concreteUnionTypeName]
    if (!concreteUnionTypeField) {
      throw new Error(
        `Expected input field for type "${concreteUnionTypeName}" in "@oneOf" input type "${inputObjectType.name}"`,
      )
    }

    return {
      [concreteUnionTypeName]: cleanDataByInputType(
        schema,
        data,
        concreteUnionTypeField.type,
      ),
    }
  }

  let cleanedData: Record<string, unknown> = {}
  for (const inputFieldName in inputObjectType.getFields()) {
    if (!(inputFieldName in data)) {
      // could be a case of missing input data; we assume we know what we are doing in the UI and don't act on it
      continue
    }

    // skip over fields where data is not or no longer defined
    if (data[inputFieldName] === undefined) {
      continue
    }

    const inputField = inputObjectType.getFields()[inputFieldName]
    cleanedData[inputFieldName] = cleanDataByInputType(
      schema,
      data[inputFieldName],
      inputField.type,
    )
  }

  return cleanedData
}

function cleanDataByInputType(
  schema: GraphQLSchema,
  data: Record<string, unknown> | unknown,
  inputType: GraphQLInputType,
): any {
  if (isListType(inputType)) {
    if (data === null) {
      return data
    }
    if (!Array.isArray(data)) {
      throw new Error('Expected array for ListType')
    }
    return data.map((datum: any) =>
      cleanDataByInputType(schema, datum, inputType.ofType),
    )
  } else if (isNonNullType(inputType)) {
    return cleanDataByInputType(schema, data, inputType.ofType)
  } else if (isNamedType(inputType)) {
    return cleanDataByNamed(schema, data, inputType)
  }
  throw new Error(`Unknown typeNode kind`)
}

function cleanDataByNamed(
  schema: GraphQLSchema,
  data: Record<string, unknown> | unknown,
  namedType: GraphQLNamedType,
): any {
  if (isScalarType(namedType)) {
    return data
  }

  if (isInputObjectType(namedType)) {
    assertIsRecordOrNull(data)
    return cleanDataByInputObjectType(schema, data, namedType)
  }

  if (isEnumType(namedType)) {
    return data
  }

  throw new Error(`Unexpected namedType "${namedType.name}"`)
}
