/**
 * Simplified Notion API client
 * This is a lightweight alternative to notion-client package,
 * tailored specifically for this website's needs.
 *
 * Key differences from notion-client:
 * - No collection fetching (not used in this site)
 * - No signed URLs (not needed for public pages)
 * - No relation pages (not used)
 * - Simpler error handling
 * - Direct fetch instead of ofetch dependency
 */

import { ExtendedRecordMap, PageChunk } from 'notion-types'
import { getPageContentBlockIds, parsePageId } from 'notion-utils'

interface NotionAPIOptions {
  apiBaseUrl?: string
  authToken?: string
  userTimeZone?: string
}

interface GetPageOptions {
  fetchMissingBlocks?: boolean
  chunkLimit?: number
  chunkNumber?: number
}

export class SimpleNotionAPI {
  private readonly apiBaseUrl: string
  private readonly authToken?: string

  constructor(options: NotionAPIOptions = {}) {
    this.apiBaseUrl = options.apiBaseUrl || 'https://www.notion.so/api/v3'
    this.authToken = options.authToken
  }

  /**
   * Fetches a Notion page with all its blocks
   * @param pageId - The Notion page ID (with or without dashes)
   * @param options - Fetch options
   * @returns ExtendedRecordMap containing all page data
   */
  async getPage(pageId: string, options: GetPageOptions = {}): Promise<ExtendedRecordMap> {
    const { fetchMissingBlocks = true, chunkLimit = 100, chunkNumber = 0 } = options

    // Step 1: Get initial page data
    const page = await this.getPageRaw(pageId, { chunkLimit, chunkNumber })
    const recordMapRaw = page?.recordMap

    if (!recordMapRaw?.block) {
      throw new Error(`Notion page not found "${pageId}"`)
    }

    // Initialize empty maps if not present and convert to ExtendedRecordMap
    const recordMap: ExtendedRecordMap = {
      ...recordMapRaw,
      collection: recordMapRaw.collection ?? {},
      collection_view: recordMapRaw.collection_view ?? {},
      notion_user: recordMapRaw.notion_user ?? {},
      collection_query: {},
      signed_urls: {}
    }

    // Step 2: Fetch missing blocks (if enabled)
    if (fetchMissingBlocks) {
      let iterations = 0
      const maxIterations = 10 // Prevent infinite loops

      while (iterations < maxIterations) {
        // Find blocks that are referenced but not yet loaded
        const pendingBlockIds = getPageContentBlockIds(recordMap).filter(id => !recordMap.block[id])

        if (!pendingBlockIds.length) {
          break
        }

        // Fetch missing blocks
        const newBlocks = await this.getBlocks(pendingBlockIds)
        recordMap.block = { ...recordMap.block, ...newBlocks.recordMap.block }

        iterations++
      }
    }

    return recordMap
  }

  /**
   * Fetches raw page data from Notion API
   * @param pageId - The Notion page ID
   * @param options - Chunk options for pagination
   * @returns PageChunk containing initial page data
   */
  async getPageRaw(
    pageId: string,
    options: { chunkLimit?: number; chunkNumber?: number } = {}
  ): Promise<PageChunk> {
    const { chunkLimit = 100, chunkNumber = 0 } = options

    const parsedPageId = parsePageId(pageId)
    if (!parsedPageId) {
      throw new Error(`Invalid notion pageId "${pageId}"`)
    }

    const body = {
      pageId: parsedPageId,
      limit: chunkLimit,
      chunkNumber,
      cursor: { stack: [] },
      verticalColumns: false
    }

    return this.fetch<PageChunk>({
      endpoint: 'loadPageChunk',
      body
    })
  }

  /**
   * Fetches multiple blocks by their IDs
   * @param blockIds - Array of block IDs to fetch
   * @returns PageChunk containing the requested blocks
   */
  async getBlocks(blockIds: string[]): Promise<PageChunk> {
    return this.fetch<PageChunk>({
      endpoint: 'syncRecordValuesMain',
      body: {
        requests: blockIds.map(blockId => ({
          table: 'block',
          id: blockId,
          version: -1
        }))
      }
    })
  }

  /**
   * Generic fetch method for Notion API
   * @param endpoint - API endpoint (e.g., 'loadPageChunk')
   * @param body - Request body
   * @param headers - Additional headers
   * @returns API response
   */
  private async fetch<T>({
    endpoint,
    body,
    headers: clientHeaders = {}
  }: {
    endpoint: string
    body: object
    headers?: Record<string, string>
  }): Promise<T> {
    const headers: Record<string, string> = {
      ...clientHeaders,
      'Content-Type': 'application/json'
    }

    if (this.authToken) {
      headers.cookie = `token_v2=${this.authToken}`
    }

    const url = `${this.apiBaseUrl}/${endpoint}`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        throw new Error(`Notion API error: ${response.status} ${response.statusText}`)
      }

      return (await response.json()) as T
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch from Notion API: ${error.message}`)
      }
      throw error
    }
  }
}

// Export a singleton instance (similar to notionX in notionx.ts)
export const simpleNotionAPI = new SimpleNotionAPI()

/**
 * Convenience function to get a page (matches the API of notionx.ts)
 * @param pageId - The Notion page ID
 * @returns ExtendedRecordMap with missing blocks fixed
 */
export async function getPageSimple(pageId: string): Promise<ExtendedRecordMap> {
  const recordMap = await simpleNotionAPI.getPage(pageId)
  const newRecordMap = await fixMissingBlocks(recordMap)
  return newRecordMap
}

/**
 * Fix missing blocks referenced in text decorations
 * (Copied from notionx.ts to maintain compatibility)
 */
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
  const missingBlocks = brokenBlockIds?.length
    ? await simpleNotionAPI.getBlocks(brokenBlockIds)
    : null
  const newBlocks = {
    ...recordMap.block,
    ...missingBlocks?.recordMap?.block
  }
  return {
    ...recordMap,
    block: newBlocks
  }
}
