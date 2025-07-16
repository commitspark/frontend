import {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLWrappingType,
  isWrappingType,
} from 'graphql/type'
import { ConstDirectiveNode } from 'graphql/language/ast'
import { Kind } from 'graphql/language'
import { GraphQLField, GraphQLNamedType } from 'graphql/type/definition'
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'

// for non-null or list types, descend to child types until a named type is found and return the named type
export function getNamedTypeFromWrappingType(
  fieldType: GraphQLWrappingType,
): GraphQLNamedType {
  if (isWrappingType(fieldType.ofType)) {
    return getNamedTypeFromWrappingType(fieldType.ofType)
  } else {
    return fieldType.ofType
  }
}

export function getFieldDirectiveByName(
  field: GraphQLField<any, any>,
  directiveName: string,
): ConstDirectiveNode | undefined {
  const uiDirective = field.astNode?.directives?.filter(
    (directiveNode) => directiveNode.name.value === directiveName,
  )?.[0]
  return uiDirective ?? undefined
}

export function getDirectiveByName(
  namedType: GraphQLNamedType,
  directiveName: string,
): ConstDirectiveNode | undefined {
  const uiDirective = namedType
    .toConfig()
    .astNode?.directives?.filter(
      (directiveNode) => directiveNode.name.value === directiveName,
    )?.[0]
  return uiDirective ?? undefined
}

export function isEqualDirectiveArgumentBooleanValue(
  directive: ConstDirectiveNode,
  argumentName: string,
  argumentValue: any,
) {
  return !!directive.arguments?.filter(
    (argument) =>
      argument.name.value === argumentName &&
      argument.value.kind === Kind.BOOLEAN &&
      argument.value.value === argumentValue,
  )?.[0]
}

// returns list of fieldNames that are marked with @Ui directive for visibility in list views
export function getListVisibleFieldNames(
  objectType: GraphQLObjectType,
): string[] {
  const fields = objectType.getFields()
  const namesMarkedVisibleFields = Object.keys(fields).filter((fieldName) => {
    const uiDirective = getFieldDirectiveByName(fields[fieldName], 'Ui')
    if (!uiDirective) {
      return false
    }
    return isEqualDirectiveArgumentBooleanValue(
      uiDirective,
      'visibleList',
      true,
    )
  })

  if (namesMarkedVisibleFields.length === 0) {
    return ['id']
  }

  return namesMarkedVisibleFields
}

export function isOneOfInputType(type: GraphQLInputObjectType): boolean {
  return (
    type.astNode?.directives?.find(
      (directive) => directive.name.value === 'oneOf',
    ) !== undefined
  )
}

export function getFieldDirectiveArgumentStringValue(
  field: GraphQLField<any, any>,
  directiveName: string,
  argumentName: string,
): string | null {
  const editorValue = getFieldDirectiveByName(
    field,
    directiveName,
  )?.arguments?.find((argument) => argument.name.value === argumentName)?.value
  if (!editorValue || editorValue.kind !== Kind.STRING) {
    return null
  }
  return editorValue.value
}

export function getNamesOfTypesAnnotatedWithDirective(
  schema: GraphQLSchema,
  directiveName: string,
): string[] {
  // get all types annotated with @Entry directive
  const entryTypeNames: string[] = []
  mapSchema(schema, {
    [MapperKind.OBJECT_TYPE]: (
      objectType: GraphQLObjectType,
    ): GraphQLObjectType => {
      const entryDirective = getDirective(
        schema,
        objectType,
        directiveName,
      )?.[0]
      if (entryDirective) {
        entryTypeNames.push(objectType.name)
      }
      return objectType
    },
  })
  return entryTypeNames
}
