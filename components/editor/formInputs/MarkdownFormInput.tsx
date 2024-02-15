import React from 'react'
import AddNamedTypeListEntryButton from '../form/AddNamedTypeListEntryButton'
import { createDefaultData } from '../../lib/default-data-generator'
import { GraphQLScalarType } from 'graphql/type'
import MarkdownInput from '../../styledInput/MarkdownInput'
import Tabs from '../../Tabs'
import TextareaInput, {
  FontClassification,
} from '../../styledInput/TextareaInput'

interface MarkdownFormInputProps {
  fieldName: string
  fieldType: GraphQLScalarType
  handleChildDataChangeRequest: (fieldName: string, newFieldValue: any) => void
  value: string | null
  readOnly?: boolean
}

const MarkdownFormInput: React.FC<MarkdownFormInputProps> = (
  props: MarkdownFormInputProps,
) => {
  if (props.value === null) {
    return (
      <AddNamedTypeListEntryButton
        typeNameLabel={props.fieldType.name}
        handleAddButtonEvent={() => {
          const defaultData = createDefaultData(props.fieldType, 1)
          props.handleChildDataChangeRequest(props.fieldName, defaultData)
        }}
      />
    )
  }

  const markdownInput = (
    <div className={'pt-2'}>
      <MarkdownInput
        name={props.fieldName}
        value={props.value}
        handleDataChangeEvent={(newValue) =>
          props.handleChildDataChangeRequest(props.fieldName, newValue)
        }
      />
    </div>
  )

  // see https://github.com/RedHatOfficial/Overpass/issues/95 for issue with non-monospace overpass font
  const textareaInput = (
    <div className={'pt-2'}>
      <TextareaInput
        handleDataChangeEvent={(newValue) =>
          props.handleChildDataChangeRequest(props.fieldName, newValue)
        }
        value={props.value}
        fontClassification={FontClassification.Monospace}
        hideRing={true}
      />
    </div>
  )

  return (
    <div className={'w-full form-input-ring p-2'}>
      <Tabs
        tabs={[
          {
            label: 'Formatted',
            content: markdownInput,
          },
          {
            label: 'Source',
            content: textareaInput,
          },
        ]}
      />
    </div>
  )
}

export default MarkdownFormInput
