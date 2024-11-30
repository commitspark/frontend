import { assertIsString } from './assert'
import type { Route } from 'next'

export const routes = {
  repositoryList,
  editingStartScreen,
  entryTypesList,
  entriesOfTypeList,
  editEntry,
  createEntry,
  signIn,
  settings,
}

function repositoryList(): Route {
  return `/` as Route
}

function editingStartScreen(owner: string, repository: string): Route {
  assertIsString(owner)
  assertIsString(repository)
  return `/repo/${owner}/${repository}/` as Route
}

function entryTypesList(owner: string, repository: string, ref: string): Route {
  assertIsString(owner)
  assertIsString(repository)
  assertIsString(ref)
  const encodedRef = encodeURIComponent(ref)
  return `/repo/${owner}/${repository}/ref/${encodedRef}` as Route
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
  return `/repo/${owner}/${repository}/ref/${encodedRef}/type/${entryType}/` as Route
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
  return `/repo/${owner}/${repository}/ref/${encodedRef}/id/${encodedEntryId}/` as Route
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
  return `/repo/${owner}/${repository}/ref/${encodedRef}/type/${entryType}/create-entry/` as Route
}

function signIn(): Route {
  return `/sign-in/` as Route
}

function settings(): Route {
  return `/settings/` as Route
}
