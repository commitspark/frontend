import { mutateContent } from './mutate'
import { GraphQLSchema } from 'graphql/type'
import {
  getTypeDefinitionNodeFromSchema,
  isKindListTypeNode,
  isKindNonNullTypeNode,
  isNamedTypeNode,
  isOneOfInputType,
} from './schema-utils'
import { Kind } from 'graphql/language'
import {
  InputObjectTypeDefinitionNode,
  NamedTypeNode,
  TypeNode,
} from 'graphql/language/ast'
import { assertIsRecordOrNull, assertIsString } from './assert'

export async function commitContentEntry(
  token: string,
  owner: string,
  repository: string,
  ref: string,
  entryId: string | null,
  schema: GraphQLSchema,
  mutationType: 'create' | 'update',
  entryData: Record<string, unknown> | null,
  typeName: string,
  commitMessage: string,
): Promise<Record<string, unknown> | null> {
  if (commitMessage.length === 0) {
    throw new Error('Commit message must not be empty')
  }

  const typeDefinitionNode = getTypeDefinitionNodeFromSchema(
    schema,
    `${typeName}Input`,
  )
  if (typeDefinitionNode.kind !== Kind.INPUT_OBJECT_TYPE_DEFINITION) {
    throw new Error('Expected input object type definition')
  }

  let cleanedData = entryData
  if (cleanedData !== null) {
    cleanedData = cleanDataByInputObjectType(
      schema,
      cleanedData,
      typeDefinitionNode,
    )
  }

  const mutation = {
    query:
      `mutation ($entryId: ID!, $commitMessage: String!, $mutationData: ${typeName}Input!){\n` +
      `data: ${mutationType}${typeName}(id:$entryId, message:$commitMessage, data:$mutationData) { id }\n` +
      '}',
    variables: {
      entryId: entryId,
      commitMessage: commitMessage,
      mutationData: cleanedData,
    },
  }

  return mutateContent(token, owner, repository, ref, mutation)
}

// returns `data` but recursively leaves out all fields that are not defined in `inputObjectTypeDefinitionNode`
function cleanDataByInputObjectType(
  schema: GraphQLSchema,
  data: Record<string, unknown> | null,
  inputObjectTypeDefinitionNode: InputObjectTypeDefinitionNode,
): Record<string, any> | null {
  if (data === null || !inputObjectTypeDefinitionNode.fields) {
    return null
  }

  // if we want to write a union that is not using @Entry-based concrete types, we use an intermediary field based
  // on the '@oneOf' directive to provide the concrete type to the backend
  // (see https://github.com/graphql/graphql-spec/pull/825)
  if (data && isOneOfInputType(inputObjectTypeDefinitionNode)) {
    const concreteUnionTypeName = data['__typename'] // this is our internal UI helper field used for the same purpose
    assertIsString(concreteUnionTypeName)
    const concreteUnionTypeFieldName =
      concreteUnionTypeName.slice(0, 1).toLowerCase() +
      concreteUnionTypeName.slice(1)
    const concreteUnionTypeField = inputObjectTypeDefinitionNode.fields?.find(
      (field) => field.name.value === concreteUnionTypeFieldName,
    )
    if (!concreteUnionTypeField) {
      throw new Error(
        `Expected input field for type "${concreteUnionTypeName}" in "@oneOf" input type "${inputObjectTypeDefinitionNode.name.value}"`,
      )
    }

    return {
      [concreteUnionTypeFieldName]: cleanDataByTypeNode(
        schema,
        data,
        concreteUnionTypeField.type,
      ),
    }
  }

  let cleanedData: Record<string, unknown> = {}
  for (const inputValueDefinition of inputObjectTypeDefinitionNode.fields) {
    if (!(inputValueDefinition.name.value in data)) {
      // could be a case of missing input data; we assume we know what we are doing in the UI and don't act on it
      continue
    }
    cleanedData[inputValueDefinition.name.value] = cleanDataByTypeNode(
      schema,
      data[inputValueDefinition.name.value],
      inputValueDefinition.type,
    )
  }

  return cleanedData
}

function cleanDataByTypeNode(
  schema: GraphQLSchema,
  data: Record<string, unknown> | unknown,
  typeNode: TypeNode,
): any {
  if (isKindListTypeNode(typeNode)) {
    if (data === null) {
      return data
    }
    if (!Array.isArray(data)) {
      throw new Error(`Expected array for ListTypeNode`)
    }
    return data.map((datum: any) =>
      cleanDataByTypeNode(schema, datum, typeNode.type),
    )
  } else if (isKindNonNullTypeNode(typeNode)) {
    return cleanDataByTypeNode(schema, data, typeNode.type)
  } else if (isNamedTypeNode(typeNode)) {
    return cleanDataByNamedTypeNode(schema, data, typeNode)
  }
  throw new Error(`Unknown typeNode kind`)
}

function cleanDataByNamedTypeNode(
  schema: GraphQLSchema,
  data: Record<string, unknown> | unknown,
  typeNode: NamedTypeNode,
): any {
  const name = typeNode.name.value
  if (
    name === 'String' ||
    name === 'ID' ||
    name === 'Int' ||
    name === 'Float' ||
    name === 'Boolean'
  ) {
    return data
  } else {
    const typeDefinitionNode = getTypeDefinitionNodeFromSchema(schema, name)
    if (typeDefinitionNode.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION) {
      assertIsRecordOrNull(data)
      return cleanDataByInputObjectType(schema, data, typeDefinitionNode)
    } else if (typeDefinitionNode.kind === Kind.ENUM_TYPE_DEFINITION) {
      return data
    } else {
      throw new Error(
        `Unexpected typeDefinitionNode kind "${typeDefinitionNode.kind}"`,
      )
    }
  }
}
