import { NotionAPI } from 'notion-client'
import { ExtendedRecordMap } from 'notion-types'

import { withRedisCache } from '@/src/lib/redis-cache'

export const notionX = new NotionAPI()

export async function getPage(pageId: string) {
  return withRedisCache(
    `page-${pageId}`,
    async () => {
      const recordMap = await notionX.getPage(pageId)
      const newRecordMap = await fixMissingBlocks(recordMap)
      return newRecordMap
    },
    {
      namespace: 'notion',
      softTTL: 3600, // 1 hour - page content changes moderately
      hardTTL: 1209600 // 14 days - safety net
    }
  )
}

async function fixMissingBlocks(recordMap: ExtendedRecordMap): Promise<ExtendedRecordMap> {
  const brokenBlockIds = [] as any
  for (const blockId of Object.keys(recordMap.block)) {
    const block = recordMap.block[blockId]?.value
    if (!block || block.type !== 'text') {
      continue
    }
    const title = block.properties?.title
    if (!title) {
      continue
    }
    title.map(([_text, decorations], _index) => {
      if (!decorations) {
        return false
      }
      const decorator = decorations[0]
      if (!decorator || decorator[0] !== 'p' || !decorator[1]) {
        return false
      }
      const bId = decorator[1]
      if (!recordMap.block[bId]?.value) {
        brokenBlockIds.push(bId)
        return true
      }
      return false
    })
  }
  const missingBlocks = brokenBlockIds?.length ? await notionX.getBlocks(brokenBlockIds) : null
  const newBlocks = {
    ...recordMap.block,
    ...missingBlocks?.recordMap?.block
  }
  return {
    ...recordMap,
    block: newBlocks
  }
}
