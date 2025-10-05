import { Block as BlockType, SyncPointerBlock as SyncPointerBlockType } from 'notion-types'
import * as React from 'react'

import { NotionBlockRenderer } from '@/src/lib/notion/renderer'

export const SyncPointerBlock: React.FC<{
  blockObj: BlockType
  levelObj: number
  showOnlyUpdatedBlocks: boolean
  setShowOnlyUpdatedBlocks: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ blockObj, levelObj, showOnlyUpdatedBlocks, setShowOnlyUpdatedBlocks }) => {
  if (!blockObj) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('missing sync pointer block', (blockObj as any).id)
    }

    return null
  }

  const syncPointerBlock = blockObj as SyncPointerBlockType
  const referencePointerId = syncPointerBlock?.format?.transclusion_reference_pointer?.id

  if (!referencePointerId) {
    return null
  }

  return (
    <NotionBlockRenderer
      key={referencePointerId}
      level={levelObj}
      blockId={referencePointerId}
      showOnlyUpdatedBlocks={showOnlyUpdatedBlocks}
      setShowOnlyUpdatedBlocks={setShowOnlyUpdatedBlocks}
    />
  )
}
