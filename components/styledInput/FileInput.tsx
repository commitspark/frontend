import React, { ChangeEventHandler } from 'react'
import { DocumentIcon } from '@heroicons/react/24/outline'

interface FileInputProps {
  id?: string
  name?: string
  disabled?: boolean
  value: File | null
  handleDataChangeEvent: (newValue: File | null) => void
}

const FileInput: React.FC<FileInputProps> = (props: FileInputProps) => {
  const fileChangedEventHandler: ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    const files = event.target.files
    if (!files || files.length === 0) {
      props.handleDataChangeEvent(null)
      return
    }

    const file = files[0]
    props.handleDataChangeEvent(file)
  }

  const labelText = props.value ? 'Change file selection' : 'Select a file'

  return (
    <div className="py-8 px-2 rounded-lg form-input-ring form-input-background flex justify-center">
      <div className="text-sm flex items-center gap-x-1.5">
        <div>
          <DocumentIcon className="icon-size-lg text-cs-gray-light" />
        </div>
        <div className="pt-1 flex">
          {props.value && <div className="pr-1.5">{props.value.name}</div>}
          <label
            htmlFor={props.id}
            className="cursor-pointer font-semibold link-colors"
          >
            <span>{labelText}</span>
            <input
              id={props.id}
              name={props.name}
              type="file"
              multiple={false}
              className="sr-only"
              disabled={props.disabled}
              onChange={fileChangedEventHandler}
            />
          </label>
        </div>
      </div>
    </div>
  )
}

export default FileInput
