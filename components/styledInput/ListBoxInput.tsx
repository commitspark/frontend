import React, { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Loading from '../Loading'
import { classNames } from '../lib/styling'

interface ListBoxInputProps {
  showLoading: boolean
  options: Record<string, any>[]
  selectedOption: Record<string, any> | null
  visibleFieldNames: string[]
  selectionChangeHandler: (selection: Record<string, any> | null) => void
  onListOpen?: () => void
}

const ListBoxInput: React.FC<React.PropsWithChildren<ListBoxInputProps>> = (
  props: React.PropsWithChildren<ListBoxInputProps>,
) => {
  return (
    <Listbox
      value={props.selectedOption}
      by={'id'}
      onChange={props.selectionChangeHandler}
    >
      {({ open }) => (
        <div className="relative">
          <Listbox.Button
            onClick={props.onListOpen}
            className="relative w-full form-input-padding form-input-text text-color form-input-ring form-input-background form-input-cursor form-input-select-cursor"
          >
            <div className="flex flex-row gap-x-2">
              <div className="flex-grow flex flex-row gap-x-2 truncate">
                {props.visibleFieldNames
                  .filter(
                    (visibleFieldName: string) =>
                      props.selectedOption &&
                      props.selectedOption[visibleFieldName] !== null,
                  )
                  .map((fieldName: any) => (
                    <div className="truncate" key={fieldName}>
                      {props.selectedOption &&
                        `${props.selectedOption[fieldName]}`}
                    </div>
                  ))}
              </div>
              <div className="flex-none pointer-events-none flex items-center">
                <ChevronUpDownIcon className="icon-size" />
              </div>
            </div>
          </Listbox.Button>

          {props.showLoading && open && (
            // TODO possibly this can be moved into Listbox.Options below?
            <div className="absolute w-full pt-1 h-32 z-10">
              <Loading />
            </div>
          )}

          <Transition
            show={!props.showLoading && open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 py-1 w-full max-h-56 overflow-y-auto form-input-background border app-border-color rounded-md">
              {props.options.map((reference) => (
                <Listbox.Option
                  key={reference.id}
                  className={({ selected }) =>
                    classNames(
                      'relative cursor-default select-none menu-item-colors menu-item-typography',
                      selected ? 'menu-item-colors-selected' : '',
                    )
                  }
                  value={reference}
                >
                  {({ selected }) => (
                    <div
                      className={classNames('px-3 py-2 flex flex-row gap-x-2')}
                    >
                      <div className="flex-grow flex flex-row gap-x-2 truncate">
                        {props.visibleFieldNames
                          .filter(
                            (visibleFieldName: string) =>
                              reference[visibleFieldName] !== null,
                          )
                          .map((visibleFieldName: string) => (
                            <div key={visibleFieldName} className="truncate">
                              {reference[visibleFieldName]}
                            </div>
                          ))}
                      </div>

                      <div
                        className={classNames(
                          'flex-none w-4 flex items-center',
                        )}
                      >
                        {selected ? <CheckIcon className="icon-size" /> : null}
                      </div>
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  )
}

export default ListBoxInput
