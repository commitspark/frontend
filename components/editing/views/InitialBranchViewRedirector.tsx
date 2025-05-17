'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCookieSession } from '@/components/lib/session'
import { RepositoryRefInfo } from '@/components/context/EditorProvider'
import { fetchSchemaString } from '@/components/lib/git-functions'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { getNamesOfTypesAnnotatedWithDirective } from '@/components/lib/schema-utils'
import { editingActivity } from '@/components/editing/editingActivity'
import { RouteIdEntriesOfTypeList } from '@/components/editing/types'

interface InitialBranchViewRedirectorProps {
  repositoryInfo: RepositoryRefInfo
}

const InitialBranchViewRedirector: React.FC<
  InitialBranchViewRedirectorProps
> = (props: InitialBranchViewRedirectorProps) => {
  const router = useRouter()

  useEffect(() => {
    const sessionPromise = getCookieSession()

    async function getDefaultTypeName(): Promise<void> {
      const session = await sessionPromise

      const schemaString = await fetchSchemaString(
        session,
        props.repositoryInfo.owner,
        props.repositoryInfo.repository,
        props.repositoryInfo.gitRef,
      )
      const schema = makeExecutableSchema({
        typeDefs: schemaString,
      })
      const entryTypeNames: string[] = getNamesOfTypesAnnotatedWithDirective(
        schema,
        'Entry',
      )

      const route = editingActivity.routeGenerator(RouteIdEntriesOfTypeList, [
        props.repositoryInfo.owner,
        props.repositoryInfo.repository,
        props.repositoryInfo.gitRef,
        entryTypeNames[0],
      ])

      router.push(route)
    }

    getDefaultTypeName()
  })
  return <></>
}

export default InitialBranchViewRedirector
