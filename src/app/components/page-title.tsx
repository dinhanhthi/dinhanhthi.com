import { Block, Decoration } from 'notion-types'
import { getBlockTitle } from 'notion-utils'
import * as React from 'react'

import { useNotionContext } from '@/src/lib/notion/context'
import { cs } from '@/src/lib/notion/utils'
import { PageIcon } from './page-icon'
import { Text } from './text'

export const PageTitleImpl: React.FC<{
  block: Block
  className?: string
  defaultIcon?: string
  hideIcon?: boolean
}> = ({ block, className, defaultIcon, hideIcon, ...rest }) => {
  const { recordMap } = useNotionContext()

  if (!block) return null

  if (block.type === 'collection_view_page' || block.type === 'collection_view') {
    const title = getBlockTitle(block, recordMap)
    if (!title) {
      return null
    }

    const titleDecoration: Decoration[] = [[title]]

    return (
      <span className={cs('notion-page-title', className)} {...rest}>
        {!hideIcon && (
          <PageIcon block={block} defaultIcon={defaultIcon} className="notion-page-title-icon" />
        )}

        <span className="notion-page-title-text">
          <Text value={titleDecoration} block={block} />
        </span>
      </span>
    )
  }

  if (!block.properties?.title) {
    return null
  }

  return (
    <span className={cs('notion-page-title', className)} {...rest}>
      {!hideIcon && (
        <PageIcon block={block} defaultIcon={defaultIcon} className="notion-page-title-icon" />
      )}

      <span className="notion-page-title-text">
        <Text value={block.properties?.title} block={block} />
      </span>
    </span>
  )
}

export const PageTitle = React.memo(PageTitleImpl)
