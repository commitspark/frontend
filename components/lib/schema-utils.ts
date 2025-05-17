import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLWrappingType,
  isWrappingType,
} from 'graphql/type'
import {
  ConstDirectiveNode,
  InputObjectTypeDefinitionNode,
  ListTypeNode,
  NamedTypeNode,
  NonNullTypeNode,
  TypeDefinitionNode,
  TypeNode,
} from 'graphql/language/ast'
import { Kind } from 'graphql/language'
import { GraphQLField, GraphQLNamedType } from 'graphql/type/definition'
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'

export function getTypeDefinitionNodeFromSchema(
  schema: GraphQLSchema,
  contentType: string,
): TypeDefinitionNode {
  const typeDeclaration = schema.getType(contentType)
  const node: TypeDefinitionNode | undefined | null =
    typeDeclaration?.toConfig().astNode
  if (!node) {
    throw new Error(
      `Definition node of content type "${contentType}" not available`,
    )
  }
  return node
}

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

export function isKindListTypeNode(node: TypeNode): node is ListTypeNode {
  return node.kind === Kind.LIST_TYPE
}

export function isKindNonNullTypeNode(node: TypeNode): node is NonNullTypeNode {
  return node.kind === Kind.NON_NULL_TYPE
}

export function isNamedTypeNode(node: TypeNode): node is NamedTypeNode {
  return node.kind === Kind.NAMED_TYPE
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

export function isOneOfInputType(
  typeNode: InputObjectTypeDefinitionNode,
): boolean {
  return (
    typeNode.directives?.find(
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
