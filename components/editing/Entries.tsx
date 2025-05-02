import List from '../List'
import { ListEntryProps } from '../ListEntry'
import React from 'react'
import { RouteIdEditEntry } from '@/components/editing/types'
import { activity } from '@/components/editing/activity'

export interface EntriesProps {
  owner: string
  repository: string
  gitRef: string
  typeName: string
  entries: Record<string, any>[]
  listVisibleFieldNames: string[]
}

const Entries: React.FC<EntriesProps> = (props: EntriesProps) => {
  const editingActivity = activity
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
      linkTarget: editingActivity.routeGenerator(RouteIdEditEntry, [
        props.owner,
        props.repository,
        props.gitRef,
        entry.id,
      ]),
      linkContent: labelData,
    } as ListEntryProps
  })

  return <List entries={entryListEntries} />
}

export default Entries
