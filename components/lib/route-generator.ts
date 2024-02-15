import { assertIsString } from './assert'
import type { Route } from 'next'

export const routes = {
  repositoryList,
  editingStartScreen,
  contentTypesList,
  contentEntriesOfTypeList,
  editContentEntry,
  createContentEntry,
}

function repositoryList(provider: string): Route {
  assertIsString(provider)
  return `/p/${provider}/` as Route
}

function editingStartScreen(
  provider: string,
  owner: string,
  repository: string,
): Route {
  assertIsString(provider)
  assertIsString(owner)
  assertIsString(repository)
  return `/p/${provider}/repo/${owner}/${repository}/` as Route
}

function contentTypesList(
  provider: string,
  owner: string,
  repository: string,
  ref: string,
): Route {
  assertIsString(provider)
  assertIsString(owner)
  assertIsString(repository)
  assertIsString(ref)
  const encodedRef = encodeURIComponent(ref)
  return `/p/${provider}/repo/${owner}/${repository}/ref/${encodedRef}` as Route
}

function contentEntriesOfTypeList(
  provider: string,
  owner: string,
  repository: string,
  ref: string,
  contentType: string,
): Route {
  assertIsString(provider)
  assertIsString(owner)
  assertIsString(repository)
  assertIsString(ref)
  assertIsString(contentType)
  const encodedRef = encodeURIComponent(ref)
  return `/p/${provider}/repo/${owner}/${repository}/ref/${encodedRef}/type/${contentType}/` as Route
}

function editContentEntry(
  provider: string,
  owner: string,
  repository: string,
  ref: string,
  entryId: string,
): Route {
  assertIsString(provider)
  assertIsString(owner)
  assertIsString(repository)
  assertIsString(ref)
  assertIsString(entryId)
  const encodedRef = encodeURIComponent(ref)
  return `/p/${provider}/repo/${owner}/${repository}/ref/${encodedRef}/id/${entryId}/` as Route
}

function createContentEntry(
  provider: string,
  owner: string,
  repository: string,
  ref: string,
  contentType: string,
): Route {
  assertIsString(provider)
  assertIsString(owner)
  assertIsString(repository)
  assertIsString(ref)
  assertIsString(contentType)
  const encodedRef = encodeURIComponent(ref)
  return `/p/${provider}/repo/${owner}/${repository}/ref/${encodedRef}/type/${contentType}/create-entry/` as Route
}
