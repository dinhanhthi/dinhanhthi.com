import {
  EquationRichTextItemResponse,
  RichTextItemResponse,
  TextRichTextItemResponse
} from '@notionhq/client/build/src/api-endpoints'
import dynamic from 'next/dynamic'
import React from 'react'

import SigmaIcon from '@/src/components/icons/SigmaIcon'
import { TextIgnoreField } from '@/src/lib/types'
import BlockText from './BlockText'

const DynamicInlineEquation = dynamic(() => import('./BlockInlineEquation'), {
  loading: () => <SigmaIcon className="w-4 h-4 text-slate-500 animate-pulse" />
})

type BlockRichTextProps = {
  richText: RichTextItemResponse
  ignore?: TextIgnoreField[]
  mathFontSize?: string
}

export default function BlockRichText(props: BlockRichTextProps) {
  switch (props.richText.type) {
    case 'text':
    case 'mention':
      return (
        <BlockText richText={props.richText as TextRichTextItemResponse} ignore={props.ignore} />
      )
    case 'equation':
      return (
        <DynamicInlineEquation
          equation={props.richText as EquationRichTextItemResponse}
          fontSize={props.mathFontSize}
        />
      )
    default:
      return <BlockText richText={props.richText as TextRichTextItemResponse} />
  }
}
