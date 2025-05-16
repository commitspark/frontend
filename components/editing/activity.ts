import { Route } from 'next'
import { assertIsString } from '@/components/lib/assert'
import { ActivityDefinition } from '@/lib/types'
import {
  EditingActivityId,
  RouteIdCreateEntry,
  RouteIdEditEntry,
  RouteIdEntriesOfTypeList,
  RouteIdEntryTypesList,
} from '@/components/editing/types'
import EditingViewSwitcher from '@/components/editing/EditingViewSwitcher'

export const activity: ActivityDefinition = {
  id: EditingActivityId,
  iconName: 'PencilSquareIcon',
  name: 'Edit',
  viewSwitcher: EditingViewSwitcher,
  routeGenerator: (routeId, args): string => {
    switch (routeId) {
      case RouteIdEntryTypesList:
        return entryTypesList(args[0], args[1], args[2])
      case RouteIdEntriesOfTypeList:
        return entriesOfTypeList(args[0], args[1], args[2], args[3])
      case RouteIdEditEntry:
        return editEntry(args[0], args[1], args[2], args[3])
      case RouteIdCreateEntry:
        return createEntry(args[0], args[1], args[2], args[3])
    }

    throw new Error(`Cannot generate route for unknown route ID ${routeId}`)
  },
  initialRouteGenerator: (repositoryOwner, repositoryName) =>
    initialView(repositoryOwner, repositoryName),
}

function initialView(owner: string, repository: string): Route {
  assertIsString(owner)
  assertIsString(repository)
  return `/repo/${owner}/${repository}/${EditingActivityId}/` as Route
}

function entryTypesList(owner: string, repository: string, ref: string): Route {
  assertIsString(owner)
  assertIsString(repository)
  assertIsString(ref)
  const encodedRef = encodeURIComponent(ref)
  return `/repo/${owner}/${repository}/${EditingActivityId}/ref/${encodedRef}` as Route
}

function entriesOfTypeList(
  owner: string,
  repository: string,
  ref: string,
  entryType: string,
): Route {
  assertIsString(owner)
  assertIsString(repository)
  assertIsString(ref)
  assertIsString(entryType)
  const encodedRef = encodeURIComponent(ref)
  return `/repo/${owner}/${repository}/${EditingActivityId}/ref/${encodedRef}/type/${entryType}/` as Route
}

function editEntry(
  owner: string,
  repository: string,
  ref: string,
  entryId: string,
): Route {
  assertIsString(owner)
  assertIsString(repository)
  assertIsString(ref)
  assertIsString(entryId)
  const encodedRef = encodeURIComponent(ref)
  const encodedEntryId = encodeURIComponent(entryId)
  return `/repo/${owner}/${repository}/${EditingActivityId}/ref/${encodedRef}/id/${encodedEntryId}/` as Route
}

function createEntry(
  owner: string,
  repository: string,
  ref: string,
  entryType: string,
): Route {
  assertIsString(owner)
  assertIsString(repository)
  assertIsString(ref)
  assertIsString(entryType)
  const encodedRef = encodeURIComponent(ref)
  return `/repo/${owner}/${repository}/${EditingActivityId}/ref/${encodedRef}/type/${entryType}/create-entry/` as Route
}
