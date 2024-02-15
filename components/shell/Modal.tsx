'use client'

import React, { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import StyledButton, { StyledButtonProps } from '../StyledButton'
import { Actions, Size } from '../StyledButtonEnums'
import { classNames } from '../lib/styling'
import DynamicIcon, { IconTheme } from '../DynamicIcon'

interface ModalProps {
  isOpen: boolean
  isCancelButtonDisabled: boolean
  onClose: () => void
  title: string
  primaryButton: React.ReactElement<StyledButtonProps>
  iconName: string
  iconBackground: Actions
}

const Modal: React.FC<React.PropsWithChildren<ModalProps>> = (
  props: React.PropsWithChildren<ModalProps>,
) => {
  const cancelButtonRef = useRef(null)

  let iconBackgroundClassName = ''
  let iconColorClassName = ''
  switch (props.iconBackground) {
    case Actions.neutral:
      iconBackgroundClassName = 'bg-gray-100'
      iconColorClassName = 'text-gray-600'
      break
    case Actions.positive:
      iconBackgroundClassName = 'bg-green-100'
      iconColorClassName = 'text-green-600'
      break
    case Actions.negative:
      iconBackgroundClassName = 'bg-red-100'
      iconColorClassName = 'text-red-600'
      break
    case Actions.primary:
      iconBackgroundClassName = 'bg-indigo-100'
      iconColorClassName = 'text-indigo-600'
      break
  }

  return (
    <>
      <Transition.Root show={props.isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={props.onClose}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full justify-center p-0 items-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all w-full max-w-lg p-6">
                  <div className="flex gap-x-4">
                    <div
                      className={classNames(
                        'h-10 w-10 flex items-center justify-center rounded-full',
                        iconBackgroundClassName,
                      )}
                    >
                      <DynamicIcon
                        iconName={props.iconName}
                        iconTheme={IconTheme.SolidIcons20}
                        className={classNames(
                          'icon-size-lg',
                          iconColorClassName,
                        )}
                      />
                    </div>
                    <div className="flex-grow">
                      <Dialog.Title
                        as="h2"
                        className="font-semibold text-gray-900"
                      >
                        {props.title}
                      </Dialog.Title>
                      <div className="mt-4">{props.children}</div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-row-reverse space-x-2 space-x-reverse">
                    <>
                      {props.primaryButton}
                      <StyledButton
                        actionType={Actions.neutral}
                        size={Size.lg}
                        disabled={props.isCancelButtonDisabled}
                        ref={cancelButtonRef}
                        onClick={props.onClose}
                      >
                        Cancel
                      </StyledButton>
                    </>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default Modal
