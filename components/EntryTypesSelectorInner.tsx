'use client'

import React, { use } from 'react'
import SelectMenu from '@/components/SelectMenu'
import { GraphQLObjectType } from 'graphql/type'
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { DropDownEntryProps } from '@/components/DropDownEntry'
import { makeExecutableSchema } from '@graphql-tools/schema'

interface EntryTypesSelectorInnerProps {
  graphQLSchemaString: Promise<string>
}

const EntryTypesSelectorInner: React.FC<EntryTypesSelectorInnerProps> = (
  props: EntryTypesSelectorInnerProps,
) => {
  const schemaString = use(props.graphQLSchemaString)

  const schema = makeExecutableSchema({
    typeDefs: schemaString,
  })

  const entryTypeNames: string[] = []
  // get all types annotated with @Entry directive
  mapSchema(schema, {
    [MapperKind.OBJECT_TYPE]: (
      objectType: GraphQLObjectType,
    ): GraphQLObjectType => {
      const entryDirective = getDirective(schema, objectType, 'Entry')?.[0]
      if (entryDirective) {
        entryTypeNames.push(objectType.name)
      }
      return objectType
    },
  })

  const menuEntries: DropDownEntryProps[] = entryTypeNames.map(
    (entryTypeName): DropDownEntryProps => {
      return {
        label: entryTypeName,
        onClickHandler: () => {
          console.log(entryTypeName)
        },
      }
    },
  )

  return (
    <SelectMenu entries={menuEntries} selectedId={entryTypeNames.at(0) ?? ''} />
  )
}

export default EntryTypesSelectorInner
