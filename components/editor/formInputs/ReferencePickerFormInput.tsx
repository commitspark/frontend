'use client'

import React, { useEffect, useState } from 'react'
import { fetchAllByType } from '../../lib/fetch'
import { getListVisibleFieldNames } from '../../lib/schema-utils'
import {
  RepositoryInfoState,
  useRepositoryInfo,
} from '../../context/RepositoryInfoProvider'
import Loading from '../../Loading'
import { GraphQLObjectType } from 'graphql/type'
import ListBoxInput from '../../styledInput/ListBoxInput'
import { commitsparkConfig } from '../../../commitspark.config'

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
  const repositoryInfoState = useRepositoryInfo() as RepositoryInfoState
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

  useEffect(() => {
    async function autoLoadReferences() {
      const token = await commitsparkConfig.createAuthenticator().getToken()
      const loadedReferences = await doFetch(
        token,
        repositoryInfoState,
        props.objectType.name,
        listVisibleFieldNames,
      )
      if (!ignore) {
        const initialValue = loadedReferences[0] ?? {}
        const newSelectedData = {
          __typename: props.objectType.name,
          ...initialValue,
        }
        setDataPossibleReferences(loadedReferences)
        setIsLoaded(true)
        setIsLoading(false)
        props.handleChildDataChangeRequest(props.fieldName, newSelectedData)
      }
    }

    let ignore = false
    if (requiresAutoLoading && !isLoaded) {
      autoLoadReferences()
      setIsLoading(true)
    }
    return () => {
      ignore = true
    }
  }, [])

  const listVisibleFieldNames = getListVisibleFieldNames(props.objectType)

  async function fetchReferences() {
    const token = await commitsparkConfig.createAuthenticator().getToken()
    let loadedReferences = await doFetch(
      token,
      repositoryInfoState,
      props.objectType.name,
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

  function selectionChangeHandler(selection: Record<string, any> | null): void {
    if (!selection) {
      props.handleChildDataChangeRequest(props.fieldName, {
        __typename: props.objectType.name,
      })
      return
    }
    props.handleChildDataChangeRequest(props.fieldName, {
      ...selection, // put all data so that the data for our listVisibleFieldNames is included
      __typename: props.objectType.name,
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

async function doFetch(
  token: string,
  repositoryInfoState: RepositoryInfoState | null,
  typeName: string,
  additionalFields: string[],
): Promise<Record<string, any>[]> {
  if (
    !repositoryInfoState ||
    !repositoryInfoState.owner ||
    !repositoryInfoState.repository ||
    !repositoryInfoState.gitRef
  ) {
    throw new Error('Expected RepositoryInfo context')
  }
  return fetchAllByType(
    token,
    repositoryInfoState.owner,
    repositoryInfoState.repository,
    repositoryInfoState.gitRef,
    typeName,
    additionalFields,
  )
}

export default ReferencePickerFormInput
