import { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'
import React from 'react'

import BlockRichText from './BlockRichText'

type ExcerptProps = {
  defaultExcerpt?: string
  excerpt: RichTextItemResponse[]
}

export default function Excerpt(props: ExcerptProps) {
  if (!props.excerpt || !props.excerpt.length) {
    if (props.defaultExcerpt) return <span>{props.defaultExcerpt}</span>
    return 'Undefined excerpt'
  }

  return (
    <span>
      {props.excerpt.map((richText, index) => (
        <BlockRichText key={index} richText={richText} ignore={['hyperlink']} />
      ))}
    </span>
  )
}
