import React, { memo, useCallback, useEffect, useRef } from 'react'
import { GraphQLObjectType } from 'graphql/type'
import Field from './Field'
import { deepEqual } from '../../lib/content-utils'

interface ContentTypeFormProps {
  objectType: GraphQLObjectType
  fieldName: string
  data: Record<string, unknown> | null
  onChildDataChangeRequestHandler: (
    childName: string,
    childData: Record<string, unknown>,
  ) => void
}

const ContentTypeForm: React.FC<ContentTypeFormProps> =
  memo<ContentTypeFormProps>(
    (props: ContentTypeFormProps) => {
      const currentData = useRef(props.data)
      const type = props.objectType

      // without this up-to-date data, we would need to have a new prop.onChildDataChangeRequestHandler for every data
      // change anywhere else in any other form/field, which would mean we would be re-rendering everything all the time
      useEffect(() => {
        currentData.current = props.data
      }, [props.data])

      // by using currentData we never need to re-instantiate this function no matter the data change that has occurred,
      // which means that this function won't be a cause for triggering child component re-renders
      const handleChildDataChangeRequest = useCallback(
        (childName: string, childData: unknown | null): void => {
          const newData = {
            ...currentData.current,
            [childName]: childData,
          }
          props.onChildDataChangeRequestHandler(props.fieldName, newData)
        },
        [],
      )

      return (
        <div className={'flex flex-col gap-y-6'}>
          {Object.keys(type.getFields()).map((fieldName, index) => {
            return (
              <div key={index}>
                {/* div element above ensures CSS spacing is applied on entire field instances only */}
                <Field
                  fieldType={type.getFields()[fieldName].type}
                  fieldName={fieldName}
                  field={type.getFields()[fieldName]}
                  isRequiredField={false}
                  data={
                    props.data
                      ? props.data[type.getFields()[fieldName].name] ?? null
                      : null
                  }
                  handleChildDataChangeRequest={handleChildDataChangeRequest}
                />
              </div>
            )
          })}
        </div>
      )
    },
    (prevProps, nextProps): boolean => {
      return deepEqual(prevProps.data, nextProps.data)
    },
  )

ContentTypeForm.displayName = 'ContentTypeForm'

export default ContentTypeForm
