'use client'

import React, { useEffect } from 'react'
import { useRepositoryInfo } from '@/components/context/RepositoryInfoProvider'
import { getCookieSession } from '@/components/lib/session'
import {
  fetchBranches,
  fetchSchemaString,
} from '@/components/lib/git-functions'
import { useRouter } from 'next/navigation'
import { editingActivity } from '@/components/editing/editingActivity'
import { RouteIdEntriesOfTypeList } from '@/components/editing/types'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { getNamesOfTypesAnnotatedWithDirective } from '@/components/lib/schema-utils'

interface InitialViewRedirectorProps {}

const InitialActivityViewRedirector: React.FC<InitialViewRedirectorProps> = (
  props: InitialViewRedirectorProps,
) => {
  const repositoryInfo = useRepositoryInfo()
  const router = useRouter()

  useEffect(() => {
    const sessionPromise = getCookieSession()

    async function getDefaultBranchName(): Promise<void> {
      if (
        !repositoryInfo ||
        !repositoryInfo.owner ||
        !repositoryInfo.repository
      ) {
        throw new Error(
          'Could not find repository information for redirecting to default branch',
        )
      }

      const session = await sessionPromise
      const branches = await fetchBranches(
        session,
        repositoryInfo?.owner,
        repositoryInfo?.repository,
      )

      // TODO query for actual default branch based on repository configuration
      const defaultBranchName =
        branches.find((branch) => branch.name === 'main')?.name ??
        branches[0].name

      const schemaString = await fetchSchemaString(
        session,
        repositoryInfo.owner,
        repositoryInfo.repository,
        defaultBranchName,
      )
      const schema = makeExecutableSchema({
        typeDefs: schemaString,
      })
      const entryTypeNames: string[] = getNamesOfTypesAnnotatedWithDirective(
        schema,
        'Entry',
      )

      const route = editingActivity.routeGenerator(RouteIdEntriesOfTypeList, [
        repositoryInfo.owner,
        repositoryInfo.repository,
        defaultBranchName,
        entryTypeNames[0],
      ])

      router.push(route)
    }

    getDefaultBranchName()
  })
  return <></>
}

export default InitialActivityViewRedirector
