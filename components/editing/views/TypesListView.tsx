import React, { Suspense } from 'react'
import { RepositoryRefInfo } from '@/components/context/EditorProvider'
import BranchesSelector from '@/components/BranchesSelector'
import Loading from '@/components/Loading'
import EntryTypesSelector from '@/components/EntryTypesSelector'
import { ChevronRightIcon } from '@heroicons/react/24/solid'

interface TypesListViewProps {
  owner: string
  name: string
  path: string[]
}

const TypesListView: React.FC<TypesListViewProps> = (
  props: TypesListViewProps,
) => {
  const decodedRef = decodeURIComponent(props.path[1])
  const repositoryInfo: RepositoryRefInfo = {
    owner: props.owner,
    repository: props.name,
    gitRef: decodedRef,
  }

  return (
    <div>
      <div className="flex flex-row gap-x-2">
        <Suspense fallback={<Loading />}>
          <BranchesSelector
            owner={repositoryInfo.owner}
            repository={repositoryInfo.repository}
            currentBranch={repositoryInfo.gitRef}
          />
        </Suspense>
        <ChevronRightIcon className="icon-size self-center" />
        <Suspense fallback={<Loading />}>
          <EntryTypesSelector repositoryInfo={repositoryInfo} />
        </Suspense>
      </div>
    </div>
  )
}

export default TypesListView
