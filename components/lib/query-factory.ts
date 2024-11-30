import {
  isEnumType,
  isNamedType,
  isObjectType,
  isScalarType,
  isUnionType,
  isWrappingType,
} from 'graphql/type'
import { getDirectiveByName, getListVisibleFieldNames } from './schema-utils'
import { GraphQLNamedType, GraphQLOutputType } from 'graphql/type/definition'

export const MAXIMUM_RECURSION_DEPTH: number = 20

export function createContentQueryFromNamedType(
  type: GraphQLNamedType,
  recursionDepth: number = 0,
): string {
  if (recursionDepth > 0 && getDirectiveByName(type, 'Entry')) {
    // node is a reference to another @Entry
    // we also want to query fields that should be displayed according to @Ui directive in order
    // to improve visualization in ReferencePicker
    let visibleExtraFields: string[] = ['id'] // we always want `id`
    if (isObjectType(type)) {
      visibleExtraFields = [
        ...visibleExtraFields,
        ...getListVisibleFieldNames(type),
      ]
    }

    // deduplicate list
    const allFields = [...new Set(visibleExtraFields)].join('\n')
    return `{\n${allFields}\n}`
  }

  if (isEnumType(type)) {
    return ''
  }

  if (isUnionType(type)) {
    let query = '__typename\n'
    query += type.getTypes().map((objectType) => {
      const typeQuery = createContentQueryFromNamedType(
        objectType,
        recursionDepth + 1,
      )
      return `... on ${objectType.name} ${typeQuery}`
    })
    return `{\n${query}}`
  }

  if (!isObjectType(type)) {
    throw new Error(`Expected GraphQLObjectType for "${type.name}"`)
  }

  if (recursionDepth > MAXIMUM_RECURSION_DEPTH) {
    throw new RecursionError()
  }

  const fieldQueryStrings: string[] = []
  for (const fieldName of Object.keys(type.getFields())) {
    try {
      const fieldQuery =
        fieldName +
        createContentQueryForFieldType(
          type.getFields()[fieldName].type,
          recursionDepth,
        )
      fieldQueryStrings.push(fieldQuery)
    } catch (error: unknown) {
      if (!(error instanceof RecursionError)) {
        throw error
      }
    }
  }

  // if we have no fields to query, we need to tell our parent field that we must not be queried at all, otherwise
  // we would have an invalid empty GraphQL query for the current type
  if (fieldQueryStrings.length === 0) {
    throw new RecursionError()
  }

  return `{\n${fieldQueryStrings.join('\n')}\n}`
}

export function createContentQueryForFieldType(
  fieldType: GraphQLOutputType,
  recursionDepth: number,
): string {
  if (isWrappingType(fieldType)) {
    return createContentQueryForFieldType(fieldType.ofType, recursionDepth)
  } else if (isScalarType(fieldType)) {
    return ''
  } else if (isNamedType(fieldType)) {
    return ' ' + createContentQueryFromNamedType(fieldType, recursionDepth + 1)
  }

  return ''
}

class RecursionError extends Error {}
