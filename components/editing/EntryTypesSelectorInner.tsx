'use client'

import React, { use } from 'react'
import SelectMenu from '@/components/SelectMenu'
import { DropDownEntryProps } from '@/components/DropDownEntry'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { editingActivity } from '@/components/editing/editingActivity'
import { RouteIdEntriesOfTypeList } from '@/components/editing/types'
import { RepositoryRefInfo } from '@/components/context/EditorProvider'
import { getNamesOfTypesAnnotatedWithDirective } from '@/components/lib/schema-utils'
import { Squares2X2Icon } from '@heroicons/react/24/outline'

interface EntryTypesSelectorInnerProps {
  repositoryInfo: RepositoryRefInfo
  graphQLSchemaString: Promise<string>
  currentTypeName: string
}

const EntryTypesSelectorInner: React.FC<EntryTypesSelectorInnerProps> = (
  props: EntryTypesSelectorInnerProps,
) => {
  const schemaString = use(props.graphQLSchemaString)

  const schema = makeExecutableSchema({
    typeDefs: schemaString,
  })

  const entryTypeNames: string[] = getNamesOfTypesAnnotatedWithDirective(
    schema,
    'Entry',
  )

  const menuEntries: DropDownEntryProps[] = entryTypeNames.map(
    (entryTypeName): DropDownEntryProps => {
      const route = editingActivity.routeGenerator(RouteIdEntriesOfTypeList, [
        props.repositoryInfo.owner,
        props.repositoryInfo.repository,
        props.repositoryInfo.gitRef,
        entryTypeName,
      ])
      return {
        label: entryTypeName,
        target: route,
      }
    },
  )

  return (
    <SelectMenu
      entries={menuEntries}
      selectedId={props.currentTypeName}
      prefixIcon={<Squares2X2Icon className="icon-size self-center" />}
    />
  )
}

export default EntryTypesSelectorInner
