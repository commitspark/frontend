import React, { use } from 'react'
import {
  EditorProvider,
  RepositoryRefInfo,
} from '@/components/context/EditorProvider'
import EntryEditor from '@/components/editor/EntryEditor'
import { getCookieSession } from '@/components/lib/session'
import { fetchSchemaString } from '@/components/lib/git-functions'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { isObjectType } from 'graphql/type'
import { getDirectiveByName } from '@/components/lib/schema-utils'
import { notFound } from 'next/navigation'
import { createDefaultData } from '@/components/lib/default-data-generator'
import { assertIsRecordOrNull } from '@/components/lib/assert'

interface EntryEditorNewViewProps {
  owner: string
  name: string
  path: string[]
}

const EntryEditorNewView: React.FC<EntryEditorNewViewProps> = (
  props: EntryEditorNewViewProps,
) => {
  const decodedRef = decodeURIComponent(props.path[1])
  const typeName = props.path[3]

  const getData = async () => {
    const repositoryInfo: RepositoryRefInfo = {
      owner: props.owner,
      repository: props.name,
      gitRef: decodedRef,
    }

    const session = await getCookieSession()

    const schemaString = await fetchSchemaString(
      session,
      repositoryInfo.owner,
      repositoryInfo.repository,
      repositoryInfo.gitRef,
    )

    const schema = makeExecutableSchema({
      typeDefs: schemaString,
    })
    const type = schema.getType(typeName)
    if (!isObjectType(type) || !getDirectiveByName(type, 'Entry')) {
      notFound()
    }

    const entryData = createDefaultData(type, 0)
    assertIsRecordOrNull(entryData)
    if (entryData === null) {
      throw new Error('Expected non-null default data for new entry')
    }

    return {
      schemaString,
      repositoryInfo,
      entryData,
    }
  }

  const data = use(getData())

  return (
    <div className="flex-grow mx-auto max-w-6xl">
      <EditorProvider
        entryProps={{
          schemaString: data.schemaString,
          isNewEntry: true,
        }}
        repositoryRefInfo={data.repositoryInfo}
      >
        <EntryEditor
          entryId={undefined}
          typeName={typeName}
          initialData={data.entryData}
        />
      </EditorProvider>
    </div>
  )
}

export default EntryEditorNewView
