import React from 'react'
import { GraphQLObjectType } from 'graphql/type'
import AddNamedTypeListEntryButton from './AddNamedTypeListEntryButton'
import { createDefaultData } from '../../lib/default-data-generator'
import { assertIsRecordOrNull } from '../../lib/assert'
import ContentTypeForm from './ContentTypeForm'

interface UserDefinedObjectTypeProps {
  fieldType: GraphQLObjectType
  fieldName: string
  isRequiredField: boolean
  data: Record<string, unknown> | null
  handleChildDataChangeRequest: (
    childName: string,
    childData: Record<string, unknown> | null,
  ) => void
}

const UserDefinedObjectType: React.FC<UserDefinedObjectTypeProps> = (
  props: UserDefinedObjectTypeProps,
) => {
  if (props.data === null) {
    return (
      <AddNamedTypeListEntryButton
        typeNameLabel={props.fieldType.name}
        handleAddButtonEvent={() => {
          const defaultData = createDefaultData(props.fieldType, 1)
          assertIsRecordOrNull(defaultData)
          props.handleChildDataChangeRequest(props.fieldName, defaultData)
        }}
      />
    )
  }

  return (
    <div className="px-4 py-6 shadow-sm form-input-ring border-gray-500/10 bg-gray-200/20">
      <fieldset className={'flex flex-col gap-y-6'}>
        <ContentTypeForm
          objectType={props.fieldType}
          fieldName={props.fieldName}
          data={props.data}
          onChildDataChangeRequestHandler={props.handleChildDataChangeRequest}
        />
      </fieldset>
    </div>
  )
}

export default UserDefinedObjectType
