'use client'

import { $getRoot, $setSelection } from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import React, { useEffect } from 'react'
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown'

interface MarkdownPropsUpdatePluginProps {
  markdown: string
}

// Lexical is not a "controlled component", i.e. it keeps internal state, causing it to not update content when
// content props have changed. This plugin takes care of updating the internal state upon props changes.
// @see https://github.com/facebook/lexical/issues/2721#issuecomment-1197698805

const MarkdownPropsUpdatePlugin: React.FC<MarkdownPropsUpdatePluginProps> = (
  props: MarkdownPropsUpdatePluginProps,
) => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    editor.update(() => {
      if ($convertToMarkdownString(TRANSFORMERS) !== props.markdown) {
        const root = $getRoot()
        // replaces existing DOM in `root` node with new markdown DOM
        $convertFromMarkdownString(props.markdown, TRANSFORMERS, root)
        // applies the new state but without a content selection
        $setSelection(null)
      }
    })
  }, [editor, props.markdown])

  return null
}

export default MarkdownPropsUpdatePlugin
