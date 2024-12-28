import List from './List'
import { ListEntryProps } from './ListEntry'
import { routes } from './lib/route-generator'
import React from 'react'

export interface EntriesProps {
  owner: string
  repository: string
  gitRef: string
  typeName: string
  entries: Record<string, any>[]
  listVisibleFieldNames: string[]
}

const Entries: React.FC<EntriesProps> = (props: EntriesProps) => {
  const entryListEntries = props.entries.map((entry: any) => {
    let labelData: Record<string, any> = {}
    if (props.listVisibleFieldNames && props.listVisibleFieldNames.length > 0) {
      for (const fieldName of props.listVisibleFieldNames) {
        labelData[fieldName] = entry[fieldName]
      }
    } else {
      labelData['id'] = entry.id
    }
    return {
      linkTarget: routes.editEntry(
        props.owner,
        props.repository,
        props.gitRef,
        entry.id,
      ),
      linkContent: labelData,
    } as ListEntryProps
  })

  return <List entries={entryListEntries} />
}

export default Entries
