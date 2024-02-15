import React from 'react'
import { classNames } from '../lib/styling'
import { Overpass_Mono } from 'next/font/google'

export enum FontClassification {
  Display,
  Monospace,
}

interface TextareaInputProps {
  name?: string
  disabled?: boolean
  rows?: number
  allowResize?: boolean
  placeholder?: string
  value: string
  handleDataChangeEvent: (newValue: string) => void
  fontClassification?: FontClassification
  hideRing?: boolean
}

const overpassMono = Overpass_Mono({
  weight: ['400'],
  subsets: ['latin'],
  style: ['normal'],
})

const TextareaInput: React.FC<TextareaInputProps> = (
  props: TextareaInputProps,
) => {
  return (
    <div
      className={classNames(
        'w-full form-input-cursor form-input-background',
        !!props.hideRing ? '' : 'form-input-ring',
      )}
    >
      <textarea
        name={props.name}
        rows={props.rows ?? 10}
        autoComplete="off"
        className={classNames(
          'w-full border-0 bg-transparent form-input-padding focus:ring-0 form-input-text form-input-cursor',
          props.fontClassification === FontClassification.Monospace
            ? `${overpassMono.className} [fontVariantLigatures:none]`
            : '',
          !props.allowResize ? '[resize:none]' : '',
        )}
        placeholder={props.placeholder}
        value={props.value ?? ''}
        onChange={(event) =>
          props.handleDataChangeEvent(event.currentTarget.value)
        }
        disabled={props.disabled}
      />
    </div>
  )
}

export default TextareaInput
