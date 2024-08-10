import { assertIsString } from './assert'
import type { Route } from 'next'

export const routes = {
  repositoryList,
  editingStartScreen,
  contentTypesList,
  contentEntriesOfTypeList,
  editContentEntry,
  createContentEntry,
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

function contentTypesList(
  owner: string,
  repository: string,
  ref: string,
): Route {
  assertIsString(owner)
  assertIsString(repository)
  assertIsString(ref)
  const encodedRef = encodeURIComponent(ref)
  return `/repo/${owner}/${repository}/ref/${encodedRef}` as Route
}

function contentEntriesOfTypeList(
  owner: string,
  repository: string,
  ref: string,
  contentType: string,
): Route {
  assertIsString(owner)
  assertIsString(repository)
  assertIsString(ref)
  assertIsString(contentType)
  const encodedRef = encodeURIComponent(ref)
  return `/repo/${owner}/${repository}/ref/${encodedRef}/type/${contentType}/` as Route
}

function editContentEntry(
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
  return `/repo/${owner}/${repository}/ref/${encodedRef}/id/${entryId}/` as Route
}

function createContentEntry(
  owner: string,
  repository: string,
  ref: string,
  contentType: string,
): Route {
  assertIsString(owner)
  assertIsString(repository)
  assertIsString(ref)
  assertIsString(contentType)
  const encodedRef = encodeURIComponent(ref)
  return `/repo/${owner}/${repository}/ref/${encodedRef}/type/${contentType}/create-entry/` as Route
}

function signIn(): Route {
  return `/sign-in/` as Route
}

function settings(): Route {
  return `/settings/` as Route
}
