import React from 'react'
import Column from './Column'
import PageHeading from '../PageHeading'
import Branches from '../Branches'
import { RepositoryInfoState } from '../context/RepositoryInfoProvider'

export interface BranchSelectorColumnProps {
  repositoryInfo: RepositoryInfoState
}

const BranchSelectorColumn: React.FC<
  React.PropsWithChildren<BranchSelectorColumnProps>
> = (props: React.PropsWithChildren<BranchSelectorColumnProps>) => {
  if (!props.repositoryInfo.owner || !props.repositoryInfo.repository) {
    throw new Error('Expected repository information')
  }

  return (
    <Column
      pageHeading={
        <div className={'bg-white border-b app-border-color px-4'}>
          <PageHeading title={'Branches'} />
        </div>
      }
    >
      <Branches
        owner={props.repositoryInfo.owner}
        repository={props.repositoryInfo.repository}
        currentBranchName={props.repositoryInfo.gitRef ?? null}
      />
    </Column>
  )
}

export default BranchSelectorColumn
