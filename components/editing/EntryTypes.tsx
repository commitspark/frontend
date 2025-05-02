import React from 'react'
import List from '../List'
import { ListEntryProps } from '../ListEntry'
import { RouteIdEntriesOfTypeList } from '@/components/editing/types'
import { activity } from '@/components/editing/activity'

export interface EntryTypesProps {
  owner: string
  repository: string
  gitRef: string
  entryTypeNames: string[]
}

const EntryTypes: React.FC<EntryTypesProps> = (props: EntryTypesProps) => {
  const editingActivity = activity
  const entryTypesListEntries = props.entryTypeNames.map(
    (entryType: string) =>
      ({
        linkTarget: editingActivity.routeGenerator(RouteIdEntriesOfTypeList, [
          props.owner,
          props.repository,
          props.gitRef,
          entryType,
        ]),
        linkContent: { name: entryType },
      } as ListEntryProps),
  )

  return <List entries={entryTypesListEntries} />
}

export default EntryTypes
