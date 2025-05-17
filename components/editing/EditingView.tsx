import React from 'react'
import EntryEditorView from '@/components/editing/views/EntryEditorView'
import EntryListView from '@/components/editing/views/EntryListView'
import EntryEditorNewView from '@/components/editing/views/EntryEditorNewView'
import { ActivityViewProps } from '@/lib/types'
import InitialActivityViewRedirector from '@/components/editing/views/InitialActivityViewRedirector'
import Loading from '@/components/Loading'
import { RepositoryRefInfo } from '@/components/context/EditorProvider'
import InitialBranchViewRedirector from '@/components/editing/views/InitialBranchViewRedirector'

const EditingView: React.FC<ActivityViewProps> = (props: ActivityViewProps) => {
  if (!props.path) {
    return null
  }

  let view = null

  if (props.path.length === 0) {
    view = (
      <div className="flex-grow py-4">
        <Loading />
        <InitialActivityViewRedirector />
      </div>
    )
  } else if (props.path.length === 2 && props.path[0] === 'ref') {
    const decodedRef = decodeURIComponent(props.path[1])
    const repositoryInfo: RepositoryRefInfo = {
      owner: props.owner,
      repository: props.name,
      gitRef: decodedRef,
    }
    view = (
      <div className="flex-grow py-4">
        <Loading />
        <InitialBranchViewRedirector repositoryInfo={repositoryInfo} />
      </div>
    )
  } else if (
    props.path.length === 4 &&
    props.path[0] === 'ref' &&
    props.path[2] === 'id'
  ) {
    view = (
      <EntryEditorView
        owner={props.owner}
        name={props.name}
        path={props.path}
      />
    )
  } else if (
    props.path.length === 4 &&
    props.path[0] === 'ref' &&
    props.path[2] === 'type'
  ) {
    view = (
      <EntryListView owner={props.owner} name={props.name} path={props.path} />
    )
  } else if (
    props.path.length === 5 &&
    props.path[0] === 'ref' &&
    props.path[2] === 'type' &&
    props.path[4] === 'create-entry'
  ) {
    view = (
      <EntryEditorNewView
        owner={props.owner}
        name={props.name}
        path={props.path}
      />
    )
  }

  return view
}

export default EditingView
