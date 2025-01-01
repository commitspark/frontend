import React from 'react'
import List from './List'
import { ListEntryProps } from './ListEntry'
import { routes } from './lib/route-generator'

export interface EntryTypesProps {
  owner: string
  repository: string
  gitRef: string
  entryTypeNames: string[]
}

const EntryTypes: React.FC<EntryTypesProps> = (props: EntryTypesProps) => {
  const entryTypesListEntries = props.entryTypeNames.map(
    (entryType: string) =>
      ({
        linkTarget: routes.entriesOfTypeList(
          props.owner,
          props.repository,
          props.gitRef,
          entryType,
        ),
        linkContent: { name: entryType },
      } as ListEntryProps),
  )

  return <List entries={entryTypesListEntries} />
}

export default EntryTypes
