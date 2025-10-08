import { AudioBlock } from 'notion-types'
import * as React from 'react'

import { useNotionContext } from '@/src/lib/notion/context'
import { cs } from '@/src/lib/notion/utils'

export const Audio: React.FC<{
  block: AudioBlock
  className?: string
}> = ({ block, className }) => {
  const { recordMap } = useNotionContext()
  const source = recordMap.signed_urls[block.id] || block.properties?.source?.[0]?.[0]

  return (
    <div className={cs('notion-audio', className)}>
      <audio controls preload="none" src={source} />
    </div>
  )
}
