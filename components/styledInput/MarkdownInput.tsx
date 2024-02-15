import React from 'react'
import { CodeNode } from '@lexical/code'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { EditorState, EditorThemeClasses, LexicalEditor } from 'lexical'
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown'
import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer'
import { assertIsStringOrNull } from '../lib/assert'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import MarkdownPropsUpdatePlugin from './MarkdownPropsUpdatePlugin'

interface MarkdownInputProps {
  name: string
  disabled?: boolean
  value: string
  handleDataChangeEvent: (newValue: string) => void
}

const MarkdownInput: React.FC<MarkdownInputProps> = (
  props: MarkdownInputProps,
) => {
  const EDITOR_NODES = [
    CodeNode,
    HeadingNode,
    LinkNode,
    ListNode,
    ListItemNode,
    QuoteNode,
  ]

  function onChange(editorState: EditorState) {
    editorState.read(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS)
      props.handleDataChangeEvent(markdown)
    })
  }

  function onError(error: Error, editor: LexicalEditor): void {
    throw error
  }

  const theme: EditorThemeClasses = {
    root: 'focus:outline-none prose max-w-none',
  }

  const initialConfig: InitialConfigType = {
    namespace: props.name,
    theme,
    onError,
    editorState: () => {
      // for some reason `null` values briefly appear here even though we never instantiate this component when no
      // data exists
      assertIsStringOrNull(props.value)
      return $convertFromMarkdownString(props.value ?? '', TRANSFORMERS)
    },
    nodes: EDITOR_NODES,
  }

  return (
    <div className={'w-full form-input-background form-input-padding'}>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="">
          <RichTextPlugin
            contentEditable={
              // minHeight fix for zero height in Firefox until first refresh
              <ContentEditable style={{ minHeight: '15em' }} />
            }
            placeholder={null}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={onChange} ignoreSelectionChange={true} />
          <ListPlugin />
          <HistoryPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <MarkdownPropsUpdatePlugin markdown={props.value} />
        </div>
      </LexicalComposer>
    </div>
  )
}

export default MarkdownInput
