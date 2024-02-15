import React from 'react'
import ListEntry, { ListEntryProps } from './ListEntry'

interface ListProps {
  entries: ListEntryProps[]
}

const List: React.FC<ListProps> = (props: ListProps) => {
  const sort = (a: ListEntryProps, b: ListEntryProps) => {
    const aValues = Object.values(a.linkContent)
    const bValues = Object.values(b.linkContent)

    for (const [i, aValue] of aValues.entries()) {
      const result = aValue
        .toLowerCase()
        .localeCompare(bValues[i].toLowerCase())
      if (result !== 0) {
        return result
      }
    }
    return 0
  }

  const sortedEntries = props.entries.sort(sort)
  return (
    <div className="bg-white shadow rounded">
      <ul className="divide-y divide-gray-100">
        {sortedEntries.map((entry, index: number) => (
          <ListEntry key={index} {...entry} />
        ))}
      </ul>
    </div>
  )
}

export default List
