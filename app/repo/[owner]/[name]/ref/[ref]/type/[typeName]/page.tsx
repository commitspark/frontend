import React from 'react'
import Entries from '../../../../../../../../components/Entries'
import PageHeading from '../../../../../../../../components/PageHeading'
import StyledButton from '../../../../../../../../components/StyledButton'
import Column from '../../../../../../../../components/shell/Column'
import {
  Actions,
  Size,
} from '../../../../../../../../components/StyledButtonEnums'
import { routes } from '../../../../../../../../components/lib/route-generator'
import Link from 'next/link'

interface ContentTypeEntriesPageParams {
  owner: string
  name: string
  ref: string
  typeName: string
}

export default function ContentTypeEntriesPage({
  params,
}: {
  params: ContentTypeEntriesPageParams
}) {
  const decodedRef = decodeURIComponent(params.ref)

  const pageHeading = (
    <div className="border-b app-border-color pr-4">
      <PageHeading
        title={`Entries of type ${params.typeName}`}
        backLink={routes.entryTypesList(params.owner, params.name, decodedRef)}
      >
        <Link
          href={routes.createEntry(
            params.owner,
            params.name,
            decodedRef,
            params.typeName,
          )}
        >
          <StyledButton actionType={Actions.positive} size={Size.lg}>
            Create new
          </StyledButton>
        </Link>
      </PageHeading>
    </div>
  )

  return (
    <Column pageHeading={pageHeading}>
      <Entries
        owner={params.owner}
        repository={params.name}
        gitRef={decodedRef}
        typeName={params.typeName}
      />
    </Column>
  )
}
