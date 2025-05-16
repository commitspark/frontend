import React from 'react'
import TypesListView from '@/components/editing/views/TypesListView'
import EntryEditorView from '@/components/editing/views/EntryEditorView'
import EntryListView from '@/components/editing/views/EntryListView'
import EntryEditorNewView from '@/components/editing/views/EntryEditorNewView'
import { ViewSwitcherProps } from '@/lib/types'

const EditingViewSwitcher: React.FC<ViewSwitcherProps> = (
  props: ViewSwitcherProps,
) => {
  if (!props.path) {
    return null
  }

  if (props.path.length === 0) {
    // TODO find a way to redirect to view of repo's default branch
    return null
  } else if (props.path.length === 2 && props.path[0] === 'ref') {
    return (
      <TypesListView path={props.path} owner={props.owner} name={props.name} />
    )
  } else if (
    props.path.length === 4 &&
    props.path[0] === 'ref' &&
    props.path[2] === 'id'
  ) {
    return (
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
    return (
      <EntryListView owner={props.owner} name={props.name} path={props.path} />
    )
  } else if (
    props.path.length === 5 &&
    props.path[0] === 'ref' &&
    props.path[2] === 'type' &&
    props.path[4] === 'create-entry'
  ) {
    return (
      <EntryEditorNewView
        owner={props.owner}
        name={props.name}
        path={props.path}
      />
    )
  }

  return null
}

export default EditingViewSwitcher
