import {
  GraphQLType,
  isEnumType,
  isListType,
  isNonNullType,
  isObjectType,
  isScalarType,
  isUnionType,
} from 'graphql/type'
import { MAXIMUM_RECURSION_DEPTH } from './query'
import { getDirectiveByName } from './schema-utils'

export function createDefaultData(
  type: GraphQLType,
  recursionDepth: number, // set to 1 when creating data for child fields on demand; see reference picker comment below
):
  | string
  | number
  | boolean
  | null
  | any[]
  | Record<string, string | number | boolean | null | any[]> {
  if (recursionDepth > MAXIMUM_RECURSION_DEPTH) {
    // TODO improve to show the recursion chain
    throw new Error(
      `Maximum recursion depth ${MAXIMUM_RECURSION_DEPTH} exceeded while generating default data. ` +
        'Possibly there is an infinite recursion of non-null fields in the schema.',
    )
  }

  if (isScalarType(type)) {
    if (type.name === 'ID') {
      return ''
    } else if (type.name === 'String') {
      return ''
    } else if (type.name === 'Int') {
      return 0
    } else if (type.name === 'Float') {
      return 0.0
    } else if (type.name === 'Boolean') {
      return false
    } else {
      return null
    }
  } else if (isObjectType(type)) {
    // if we are not initializing the root Entry, we need to generate a reference, not fields
    if (recursionDepth > 0 && getDirectiveByName(type, 'Entry')) {
      // this is a hack; since we only deal with mandatory data in this function, we would need to load all entries of
      // this type and return the ID of one entry to use as a default value; however, it is really difficult to load
      // entries here, so we just initialize with an empty object so that a reference picker widget is created and let
      // this picker autoload a default once it is rendered in the UI
      return {}
    }

    const fieldData: Record<string, any> = {}
    for (const fieldName of Object.keys(type.getFields())) {
      const fieldType = type.getFields()[fieldName].type
      // we only need to generate data for mandatory fields
      if (isNonNullType(fieldType)) {
        fieldData[fieldName] = createDefaultData(fieldType, recursionDepth + 1)
      } else {
        fieldData[fieldName] = null
      }
    }
    return fieldData
  } else if (isUnionType(type)) {
    // cannot decide this automatically
    return null
  } else if (isEnumType(type)) {
    return type.getValues().at(0)?.value
  } else if (isListType(type)) {
    return []
  } else if (isNonNullType(type)) {
    return createDefaultData(type.ofType, recursionDepth + 1)
  }

  return null
}
