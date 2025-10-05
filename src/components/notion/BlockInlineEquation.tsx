'use client'

import Katex from '@matejmazur/react-katex'
import { EquationRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'
import React from 'react'

import { generateTextAnnotationClasses } from '@/src/lib/notion/helpers'

type BlockInlineEquationProps = {
  equation: EquationRichTextItemResponse
  fontSize?: string
}

export default function BlockInlineEquation(props: BlockInlineEquationProps) {
  return (
    <span className={generateTextAnnotationClasses(props.equation.annotations)}>
      <Katex
        className={props.fontSize ?? 'text-base'}
        math={props.equation.plain_text}
        settings={{
          throwOnError: false,
          strict: false
        }}
      />
    </span>
  )
}
