import Katex from '@matejmazur/react-katex'
import { EquationBlock } from 'notion-types'
import { getBlockTitle } from 'notion-utils'
import * as React from 'react'

import { useNotionContext } from '@/src/lib/notion/context'
import { cs } from '@/src/lib/notion/utils'

const katexSettings = {
  throwOnError: false,
  strict: false
}

export default function BlockEquation(props: {
  block?: EquationBlock
  math?: string
  inline?: boolean
  className?: string
  updatedBlock?: React.ReactElement
  blurBlockClassName?: string
}) {
  const { block, math, inline = false, className } = props
  const { recordMap } = useNotionContext()
  const math2Use = math ?? (block ? getBlockTitle(block, recordMap) : null)
  if (!math2Use) return null

  return (
    <span
      tabIndex={0}
      className={cs(
        'notion-equation',
        inline
          ? 'notion-equation-inline'
          : 'm2it-scrollbar m2it-scrollbar-small relative block overflow-x-auto overflow-y-hidden text-center',
        className,
        props.blurBlockClassName
      )}
    >
      {!!props.updatedBlock && !inline && props.updatedBlock}
      <Katex math={math2Use} settings={katexSettings} block={!inline} />
    </span>
  )
}
