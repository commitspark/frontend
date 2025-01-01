'use client'

import React, { useEffect, useState } from 'react'
import { getListVisibleFieldNames } from '../../lib/schema-utils'
import Loading from '../../Loading'
import { GraphQLObjectType } from 'graphql/type'
import ListBoxInput from '../../styledInput/ListBoxInput'
import { EditorContextValue, useEditor } from '../../context/EditorProvider'
import { getCookieSession } from '../../lib/session'
import { actionFetchAllByType } from '../../../app/server-actions/actions'

interface ReferencePickerFormInputProps {
  objectType: GraphQLObjectType
  fieldName: string
  isRequired: boolean
  data: Record<string, unknown> | null
  handleChildDataChangeRequest: (fieldName: string, newFieldValue: any) => void
}

const ReferencePickerFormInput: React.FC<ReferencePickerFormInputProps> = (
  props: ReferencePickerFormInputProps,
) => {
  const { handleChildDataChangeRequest, fieldName, objectType } = props

  const editorContext = useEditor() as EditorContextValue
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const requiresAutoLoading =
    // we never offer a `null` selection, therefore `isRequired` must be handled in the parent component where
    // the picker can be removed completely when the selection should be `null`
    props.data === null ||
    Object.keys(props.data).length === 0 ||
    (Object.keys(props.data).length === 1 && !!props.data['__typename']) // if we are a union field

  const [dataPossibleReferences, setDataPossibleReferences] = useState<
    Record<string, any>[]
  >(props.data ? [props.data] : [])

  const listVisibleFieldNames = getListVisibleFieldNames(objectType)

  useEffect(() => {
    const autoLoadReferences = async (): Promise<void> => {
      const session = await getCookieSession()
      const loadedReferences = await actionFetchAllByType(
        session,
        editorContext.repositoryRefInfo.owner,
        editorContext.repositoryRefInfo.repository,
        editorContext.repositoryRefInfo.gitRef,
        objectType.name,
        listVisibleFieldNames,
      )
      const initialValue = loadedReferences[0] ?? {}
      const newSelectedData = {
        __typename: objectType.name,
        ...initialValue,
      }
      setDataPossibleReferences(loadedReferences)
      setIsLoaded(true)
      setIsLoading(false)
      handleChildDataChangeRequest(fieldName, newSelectedData)
    }

    if (requiresAutoLoading && !isLoaded && !isLoading) {
      autoLoadReferences()
    }

    return () => {}
  }, [
    editorContext,
    isLoading,
    isLoaded,
    handleChildDataChangeRequest,
    requiresAutoLoading,
    objectType,
    fieldName,
    listVisibleFieldNames,
  ])

  const fetchReferences = async (): Promise<void> => {
    const session = await getCookieSession()
    let loadedReferences = await actionFetchAllByType(
      session,
      editorContext.repositoryRefInfo.owner,
      editorContext.repositoryRefInfo.repository,
      editorContext.repositoryRefInfo.gitRef,
      objectType.name,
      listVisibleFieldNames,
    )

    // if a reference was already selected, make sure to not add it a second time from our loaded data
    const existingData = props.data
    if (existingData) {
      loadedReferences = loadedReferences.filter(
        (loadedReference) => loadedReference.id !== existingData.id,
      )
      loadedReferences.push(existingData)
    }

    setDataPossibleReferences(loadedReferences)
    setIsLoaded(true)
    setIsLoading(false)
  }

  const selectionChangeHandler = (
    selection: Record<string, any> | null,
  ): void => {
    if (!selection) {
      handleChildDataChangeRequest(fieldName, {
        __typename: objectType.name,
      })
      return
    }
    handleChildDataChangeRequest(fieldName, {
      ...selection, // put all data so that the data for our listVisibleFieldNames is included
      __typename: objectType.name,
    })
  }

  return (
    <>
      {requiresAutoLoading && <Loading />}
      {!requiresAutoLoading && (
        <ListBoxInput
          showLoading={isLoading}
          options={dataPossibleReferences}
          selectedOption={props.data}
          visibleFieldNames={listVisibleFieldNames}
          selectionChangeHandler={selectionChangeHandler}
          onListOpen={() => {
            if (!isLoaded && !isLoading) {
              setIsLoading(true)
              fetchReferences()
            }
          }}
        />
      )}
    </>
  )
}

export default ReferencePickerFormInput
