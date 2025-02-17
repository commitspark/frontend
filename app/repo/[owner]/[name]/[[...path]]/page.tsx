import React, { ReactNode } from 'react'
import { getCookieSession } from '@/components/lib/session'
import { fetchBranches } from '@/components/lib/git-functions'
import BranchSelectorColumn from '@/components/shell/BranchSelectorColumn'
import Application, { Activity, Layout } from '@/components/shell/Application'
import { notFound } from 'next/navigation'
import renderEntryTypes from '@/app/repo/[owner]/[name]/[[...path]]/entryTypes'
import renderEntryEditor from '@/app/repo/[owner]/[name]/[[...path]]/entryEditor'
import renderEntryList from '@/app/repo/[owner]/[name]/[[...path]]/entryList'
import renderEntryEditorNew from '@/app/repo/[owner]/[name]/[[...path]]/entryEditorNew'

interface ApplicationPageParams {
  owner: string
  name: string
  path?: string[]
}

export default async function ApplicationPage({
  params,
}: {
  params: ApplicationPageParams
}) {
  const { owner, name, path } = await params

  const repositoryInfo = {
    owner: owner,
    repository: name,
  }

  const session = await getCookieSession()
  const branches = await fetchBranches(
    session,
    repositoryInfo.owner,
    repositoryInfo.repository,
  )
  const currentBranch =
    path && path.length >= 2 && path[0] === 'ref'
      ? decodeURIComponent(path[1])
      : null

  const branchSelectorColumn = (
    <BranchSelectorColumn
      repositoryInfo={repositoryInfo}
      branches={branches}
      currentBranch={currentBranch}
    />
  )

  let applicationBody: ReactNode | undefined

  if (path === undefined) {
    applicationBody = <></>
  } else if (path?.length === 2 && path[0] === 'ref') {
    applicationBody = await renderEntryTypes(owner, name, path)
  } else if (path?.length === 4 && path[0] === 'ref' && path[2] === 'id') {
    applicationBody = await renderEntryEditor(owner, name, path)
  } else if (path?.length === 4 && path[0] === 'ref' && path[2] === 'type') {
    applicationBody = await renderEntryList(owner, name, path)
  } else if (
    path?.length === 5 &&
    path[0] === 'ref' &&
    path[2] === 'type' &&
    path[4] === 'create-entry'
  ) {
    applicationBody = await renderEntryEditorNew(owner, name, path)
  } else {
    notFound()
  }

  return (
    <Application
      layout={Layout.TwoColumn}
      activity={Activity.editing}
      repositoryInfo={repositoryInfo}
      asideColumn={branchSelectorColumn}
    >
      {applicationBody}
    </Application>
  )
}
