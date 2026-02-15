import {
  BlockObjectResponse,
  ListBlockChildrenResponse,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
  RichTextItemResponse
} from '@notionhq/client/build/src/api-endpoints'
import _ from 'lodash'
import { CollectionInstance, SearchParams } from 'notion-types'
import { getPageContentBlockIds, parsePageId } from 'notion-utils'
// Removed open-graph-scraper to avoid cheerio dependency issues
import pMemoize from 'p-memoize'

import { redisCacheTTL } from '@/src/lib/config'
import { cleanText, defaultBlurData, idToUuid } from '@/src/lib/helpers'
import { withRedisCache } from '@/src/lib/redis-cache'
import { BookmarkPreview, NotionSorts } from '@/src/lib/types'

export const notionMaxRequest = 100

/**
 * Normalize Notion API v3 recordMap format back to v2 format.
 *
 * In v3 (`__version__: 3`), each entry in `block`, `collection`, etc. is wrapped as:
 *   `{ value: { value: <actual data>, role: "..." } }`
 * In v2, it was:
 *   `{ value: <actual data> }`
 *
 * This function unwraps v3 to v2 so all downstream code works unchanged.
 */
function normalizeRecordMap(recordMap: any): any {
  if (!recordMap || recordMap.__version__ !== 3) return recordMap

  const tablesToNormalize = [
    'block',
    'collection',
    'collection_view',
    'notion_user',
    'space',
    'custom_emoji'
  ]

  for (const table of tablesToNormalize) {
    const entries = recordMap[table]
    if (!entries) continue

    for (const id of Object.keys(entries)) {
      const entry = entries[id]
      // v3 pattern: entry.value = { value: actualData, role: "..." }
      // v2 pattern: entry.value = actualData (which has id, type, properties, etc.)
      if (entry?.value?.value && entry.value.role !== undefined) {
        entries[id] = { value: entry.value.value, role: entry.value.role }
      }
    }
  }

  return recordMap
}

/**
 * Simple Open Graph metadata fetcher without cheerio dependency
 * Uses regex to extract OG tags from HTML
 */
async function fetchOpenGraphData(url: string) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; bot/1.0)'
      }
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      return { error: true, result: {} }
    }

    const html = await response.text()

    // Extract OG tags using regex (simple approach without HTML parser)
    const ogTitle = html.match(
      /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i
    )?.[1]
    const ogDescription = html.match(
      /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i
    )?.[1]
    const ogImage = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i
    )?.[1]
    const ogUrl = html.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']*)["']/i)?.[1]
    const favicon = html.match(
      /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["']/i
    )?.[1]

    return {
      error: false,
      result: {
        ogTitle: ogTitle || undefined,
        ogDescription: ogDescription || undefined,
        ogImage: ogImage ? [{ url: ogImage }] : undefined,
        ogUrl: ogUrl || url,
        favicon: favicon || undefined
      }
    }
  } catch (error) {
    console.error('Failed to fetch Open Graph data:', error)
    return { error: true, result: {} }
  }
}

/**
 * Unofficial API for getting all pages in a database
 */
export async function getUnofficialDatabaseImpl(opts: {
  spaceId?: string
  sourceId?: string
  collectionViewId?: string
  notionApiWeb?: string
  whoIsCalling?: string
  uri?: string
}): Promise<CollectionInstance> {
  const { spaceId, sourceId, collectionViewId, notionApiWeb } = opts
  if (!spaceId) throw new Error('spaceId is not defined')
  if (!sourceId) throw new Error('sourceId is not defined')
  if (!collectionViewId) throw new Error('collectionViewId is not defined')
  if (!notionApiWeb) throw new Error('notionApiWeb is not defined')

  const body = {
    collectionView: {
      id: collectionViewId,
      spaceId
    },
    source: {
      type: 'collection',
      id: sourceId,
      spaceId
    },
    loader: {
      reducers: {
        collection_group_results: {
          type: 'results',
          limit: 9999
        },
        'table:uncategorized:title:count': {
          type: 'aggregation',
          aggregation: {
            property: 'title',
            aggregator: 'count'
          }
        }
      },
      userTimeZone: 'America/Chicago'
    }
  }

  const url = `${notionApiWeb}/queryCollection`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const error = new Error(
        `Unofficial Notion API error: ${response.status} ${response.statusText}`
      ) as any
      error.status = response.status
      throw error
    }

    const data = await response.json()
    if (data?.recordMap) {
      data.recordMap = normalizeRecordMap(data.recordMap)
    }
    return data
  } catch (error: any) {
    console.error('🚨 Unofficial Notion API error:', error)

    // Throw error so withRedisCache can:
    // 1. Fallback to stale cache (if available)
    // 2. Send a single error email (avoiding duplicates)
    throw error
  }
}

export const getUnofficialDatabase = pMemoize(getUnofficialDatabaseImpl, {
  cacheKey: (...args) => JSON.stringify(args)
})

/**
 * https://developers.notion.com/reference/post-database-query
 */
export async function queryDatabaseImpl(opts: {
  dbId: string
  filter?: QueryDatabaseParameters['filter']
  startCursor?: string
  pageSize?: number
  sorts?: NotionSorts[]
  notionToken?: string
  notionVersion?: string
  whoIsCalling?: string
  uri?: string
}): Promise<QueryDatabaseResponse> {
  const {
    dbId,
    filter,
    startCursor,
    pageSize = notionMaxRequest,
    sorts,
    notionToken,
    notionVersion,
    whoIsCalling,
    uri
  } = opts
  try {
    const url = `https://api.notion.com/v1/databases/${dbId}/query`
    const requestBody = {
      filter,
      sorts,
      start_cursor: startCursor,
      page_size: pageSize
    }
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${notionToken || process.env.NOTION_TOKEN}`,
        'Notion-Version': notionVersion || (process.env.NOTION_VERSION as string),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    let data = await res.json()

    let children = data?.results as QueryDatabaseResponse['results']
    if (
      data &&
      data['has_more'] &&
      data['next_cursor'] &&
      pageSize &&
      pageSize >= notionMaxRequest
    ) {
      while (data!['has_more']) {
        const nextCursor = data!['next_cursor']
        data = await queryDatabaseImpl({
          dbId,
          filter,
          startCursor: nextCursor!,
          pageSize,
          sorts,
          notionToken,
          notionVersion,
          whoIsCalling,
          uri
        })
        if (_.get(data, 'results')) {
          const lst = data['results'] as any[]
          children = [...children, ...lst]
        }
      }
    }
    return { results: children } as QueryDatabaseResponse
  } catch (error: any) {
    const retryAfter = error?.response?.headers['retry-after'] || error['retry-after']
    if (retryAfter || error?.status === 502) {
      console.log(`Retrying after ${retryAfter} seconds`)
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000 + 500))
      return await queryDatabaseImpl({
        dbId,
        filter,
        startCursor,
        pageSize,
        sorts,
        notionToken,
        notionVersion,
        whoIsCalling
      })
    }
    console.error(`🚨 queryDatabaseImpl error for dbId ${dbId}:`, error)

    // Throw error so withRedisCache can fallback to stale cache
    // instead of caching empty results
    throw error
  }
}

export const queryDatabase = pMemoize(queryDatabaseImpl, {
  cacheKey: (...args) => JSON.stringify(args)
})

/**
 * https://developers.notion.com/reference/retrieve-a-database
 */
export const retrieveDatabaseImpl = async (
  dbId: string,
  notionToken?: string,
  notionVersion?: string
) => {
  const url = `https://api.notion.com/v1/databases/${dbId}`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${notionToken || process.env.NOTION_TOKEN}`,
      'Notion-Version': notionVersion || (process.env.NOTION_VERSION as string),
      'Content-Type': 'application/json'
    }
  })
  return await res.json()
}

export const retrieveDatabase = pMemoize(retrieveDatabaseImpl, {
  cacheKey: (...args) => JSON.stringify(args)
})

/**
 * https://developers.notion.com/reference/retrieve-a-page
 */
export const retrievePageImpl = async (
  pageId: string,
  notionToken?: string,
  notionVersion?: string
) => {
  const url = `https://api.notion.com/v1/pages/${pageId}`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${notionToken || process.env.NOTION_TOKEN}`,
      'Notion-Version': notionVersion || (process.env.NOTION_VERSION as string),
      'Content-Type': 'application/json'
    }
  })
  return await res.json()
}

export const retrievePage = pMemoize(retrievePageImpl, {
  cacheKey: (...args) => JSON.stringify(args)
})

/**
 * https://developers.notion.com/reference/get-block-children
 */
export const retrieveBlockChildren = async (
  pageId: string,
  pageSize?: number,
  startCursor?: string,
  notionToken?: string,
  notionVersion?: string
) => {
  let url = `https://api.notion.com/v1/blocks/${pageId}/children`
  if (pageSize) {
    url += `?page_size=${pageSize}`
    if (startCursor) url += `&start_cursor=${startCursor}`
  } else if (startCursor) url += `?start_cursor=${startCursor}`

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${notionToken || process.env.NOTION_TOKEN}`,
      'Notion-Version': notionVersion || (process.env.NOTION_VERSION as string)
    }
  })
  return res.json()
}

export async function getCustomEmojiBlock(opts: {
  pageWithDash?: string
  customEmojiId?: string
  apiUrl?: string
}) {
  const { pageWithDash, customEmojiId, apiUrl } = opts

  if (!pageWithDash) throw new Error('pageWithDash is not defined')
  if (!customEmojiId) throw new Error('customEmojiId is not defined')
  if (!apiUrl) throw new Error('apiUrl is not defined')

  try {
    const headers: any = {
      'Content-Type': 'application/json'
    }
    const body = {
      page: {
        id: pageWithDash
      },
      verticalColumns: false
    }
    const data = await fetch(`${apiUrl}/loadCachedPageChunkV2`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    }).then(res => res.json())
    if (data?.recordMap) {
      data.recordMap = normalizeRecordMap(data.recordMap)
    }
    return data?.recordMap?.custom_emoji?.[customEmojiId]?.value
  } catch (error) {
    console.error('🚨 Error in getCustomEmojiBlock()', error)
    return []
  }
}

/**
 * Get all nested blocks (in all levels) of a block.
 */
export async function getBlocks(
  blockId: string,
  initNumbering?: string,
  getPageUri?: (_pageId: string) => Promise<string | undefined>,
  parseImgurUrl?: (_url: string) => string,
  notionToken?: string,
  notionVersion?: string
): Promise<ListBlockChildrenResponse['results']> {
  // Cache key includes blockId only - other params affect rendering, not data fetching
  const cacheKey = `blocks-${blockId}`

  return withRedisCache(
    cacheKey,
    async () =>
      getBlocksImpl(blockId, initNumbering, getPageUri, parseImgurUrl, notionToken, notionVersion),
    {
      namespace: 'notion',
      whoIsCalling: 'notion/db.ts/getBlocks',
      ...redisCacheTTL.blocks
    }
  )
}

/**
 * Implementation of getBlocks (extracted for caching)
 */
async function getBlocksImpl(
  blockId: string,
  initNumbering?: string,
  getPageUri?: (_pageId: string) => Promise<string | undefined>,
  parseImgurUrl?: (_url: string) => string,
  notionToken?: string,
  notionVersion?: string
): Promise<ListBlockChildrenResponse['results']> {
  let data = await retrieveBlockChildren(blockId, undefined, undefined, notionToken, notionVersion)
  let blocks = data?.results as
    | (BlockObjectResponse & {
        list_item?: string
        children?: ListBlockChildrenResponse['results']
        imageInfo?: any
        imgUrl?: string
        bookmark?: BookmarkPreview
      })[]
    | []

  if (!blocks?.length) return []

  if (data && data['has_more']) {
    while (data!['has_more']) {
      const startCursor = data!['next_cursor'] as string
      data = await retrieveBlockChildren(
        blockId,
        undefined,
        startCursor,
        notionToken,
        notionVersion
      )
      if (_.get(data, 'results') && _.get(data, 'results').length) {
        const lst = data!['results'] as any[]
        blocks = [...blocks, ...lst]
      }
    }
  }

  let number = 1
  for (const block of blocks) {
    /**
     * Remark: Consider 2 cases:
     * ++ First:
     * 1. Item 1
     * Paragraph
     * 1. Item 2
     *
     * ++ Second:
     * 1. Item 1
     * 2. Item 2
     *
     * The Notion API doesn't give any information in that Item 1 and Item 2 of the first case are
     * in diffrent uls while in the second case, they are in the same ul.
     *
     * They are both in the same structure.
     * Check: https://developers.notion.com/reference/block#numbered-list-item-blocks
     *
     * That's why we add some additional information to the block.
     */
    if (block.type === 'numbered_list_item') {
      if (initNumbering && ['1', '2', '3'].includes(initNumbering)) initNumbering = undefined
      block['list_item'] = (initNumbering ?? '') + `${number}.`
      number++
    } else {
      number = 1
    }

    if (block.type === 'bulleted_list_item') {
      block['list_item'] = !initNumbering ? '1' : initNumbering === '1' ? '2' : '3'
    }

    if (_.get(block, `${block.type}.rich_text`) && !!getPageUri) {
      const parsedMention = await parseMention(
        _.get(block, `${block.type}.rich_text`) as any,
        getPageUri
      )
      _.set(block, `${block.type}.rich_text`, parsedMention)
    }

    if (block.has_children) {
      const children = await getBlocks(
        block.id,
        block['list_item'],
        getPageUri,
        parseImgurUrl,
        notionToken,
        notionVersion
      )
      block['children'] = children
    }

    // Get real image size (width and height) of an image block
    if (block.type === 'image') {
      const url = _.get(block, 'image.file.url') || _.get(block, 'image.external.url')
      if (url) {
        if (parseImgurUrl) block['imgUrl'] = parseImgurUrl(url)
        block['imageInfo'] = {
          base64: defaultBlurData.url,
          width: defaultBlurData.width,
          height: defaultBlurData.height
        }
      }
    }

    // bookmark
    if (block.type === 'bookmark') {
      const url = _.get(block, 'bookmark.url')
      if (url) {
        const { result } = await fetchOpenGraphData(url)
        const bookmark: BookmarkPreview = {
          url,
          title: cleanText(result.ogTitle),
          description: cleanText(result.ogDescription) ?? null,
          favicon: result.favicon?.includes('http')
            ? result.favicon
            : result?.ogUrl && result?.favicon
              ? result?.ogUrl + result?.favicon?.replace('/', '')
              : undefined,
          imageSrc: result.ogImage?.[0]?.url ?? null
        }
        block['bookmark'] = bookmark as any
      }
    }
  }

  return blocks
}

async function parseMention(
  richText: RichTextItemResponse[] | [],
  getPageUri?: (_pageId: string) => Promise<string | undefined>
): Promise<any> {
  if (!richText?.length) return []
  const newRichText = [] as RichTextItemResponse[]
  for (const block of richText) {
    if (block.type === 'mention' && block.mention?.type === 'page') {
      const pageId = _.get(block, 'mention.page.id')
      if (pageId && getPageUri) {
        const pageUri = await getPageUri(pageId)
        _.set(block, 'mention.page.uri', pageUri)
      }
      newRichText.push(block)
    } else {
      newRichText.push(block)
    }
  }
  return newRichText
}

// Used for unofficial APIs
export async function searchNotion(
  params: SearchParams,
  apiUrl: string,
  tokenV2: string,
  activeUser: string,
  dbId: string
): Promise<any> {
  if (!apiUrl) throw new Error('apiUrl is not defined')
  if (!tokenV2) throw new Error('tokenV2 is not defined')
  if (!activeUser) throw new Error('activeUser is not defined')

  const headers: any = {
    'Content-Type': 'application/json',
    cookie: `token_v2=${tokenV2}`,
    'x-notion-active-user-header': activeUser
  }

  if (!dbId) {
    throw new Error('dbId is not defined')
  }

  const body = {
    type: 'BlocksInAncestor',
    source: 'quick_find_public',
    ancestorId: idToUuid(dbId),
    sort: {
      field: 'relevance'
    },
    limit: params.limit || 100,
    query: params.query,
    filters: {
      isDeletedOnly: false,
      isNavigableOnly: false,
      excludeTemplates: true,
      requireEditPermissions: false,
      ancestors: [],
      createdBy: [],
      editedBy: [],
      lastEditedTime: {},
      createdTime: {},
      ...params.filters
    }
  }

  const url = `${apiUrl}/search`

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Notion search API error: ${response.status} - ${text}`)
  }

  const searchData = await response.json()
  if (searchData?.recordMap) {
    searchData.recordMap = normalizeRecordMap(searchData.recordMap)
  }
  return searchData
}

/**
 * ========================================================================
 * Simple Notion API - Lightweight alternative to notion-client package
 * ========================================================================
 * Simplified Notion API client tailored specifically for this website's needs.
 *
 * Key differences from notion-client:
 * - No collection fetching (not used in this site)
 * - No signed URLs (not needed for public pages)
 * - No relation pages (not used)
 * - Simpler error handling
 * - Direct fetch instead of ofetch dependency
 * - Functional approach instead of class-based
 */

/**
 * Generic fetch method for Notion API
 */
async function notionFetch<T>(endpoint: string, body: object): Promise<T> {
  // console.log('👉 notionFetch() called with endpoint:', endpoint)
  const url = `${process.env.NOTION_API_PUBLISHED || 'https://www.notion.so/api/v3'}/${endpoint}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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

/**
 * Fetches raw page data from Notion API
 * @param pageId - The Notion page ID
 * @returns PageChunk containing initial page data
 */
async function getPageRaw(pageId: string): Promise<any> {
  const parsedPageId = parsePageId(pageId)
  if (!parsedPageId) {
    throw new Error(`Invalid notion pageId "${pageId}"`)
  }

  const body = {
    pageId: parsedPageId,
    limit: 100,
    chunkNumber: 0,
    cursor: { stack: [] },
    verticalColumns: false
  }

  const data = await notionFetch<any>('loadPageChunk', body)
  if (data?.recordMap) {
    data.recordMap = normalizeRecordMap(data.recordMap)
  }
  return data
}

/**
 * Fetches multiple blocks by their IDs
 * @param blockIds - Array of block IDs to fetch
 * @returns PageChunk containing the requested blocks
 */
export async function getBlocksByIds(blockIds: string[]): Promise<any> {
  const data = await notionFetch<any>('syncRecordValuesMain', {
    requests: blockIds.map(blockId => ({
      table: 'block',
      id: blockId,
      version: -1
    }))
  })
  if (data?.recordMap) {
    data.recordMap = normalizeRecordMap(data.recordMap)
  }
  return data
}

/**
 * Fetches a Notion page with all its blocks
 * @param pageId - The Notion page ID (with or without dashes)
 * @returns ExtendedRecordMap containing all page data
 */
export async function getPage(pageId: string): Promise<any> {
  // Step 1: Get initial page data
  const page = await getPageRaw(pageId)
  const recordMapRaw = page?.recordMap

  if (!recordMapRaw?.block) {
    throw new Error(`Notion page not found "${pageId}"`)
  }

  // Initialize empty maps if not present and convert to ExtendedRecordMap
  const recordMap: any = {
    ...recordMapRaw,
    collection: recordMapRaw.collection ?? {},
    collection_view: recordMapRaw.collection_view ?? {},
    notion_user: recordMapRaw.notion_user ?? {},
    collection_query: {},
    signed_urls: {}
  }

  // Step 2: Fetch missing blocks (if enabled)
  let iterations = 0
  const maxIterations = 10 // Prevent infinite loops

  while (iterations < maxIterations) {
    // Find blocks that are referenced but not yet loaded
    const pendingBlockIds = getPageContentBlockIds(recordMap).filter(id => !recordMap.block[id])

    if (!pendingBlockIds.length) {
      break
    }

    // Fetch missing blocks
    const newBlocks = await getBlocksByIds(pendingBlockIds)
    recordMap.block = { ...recordMap.block, ...newBlocks.recordMap.block }

    iterations++
  }

  return recordMap
}

// When a database is publised, we open that page and use the search API to get the results
// It doesn't use notion.so/api/v1/search, it uses personal.notion.site/api/v3/search instead
// It doesn't require any token or active user!
export async function searchNotionPersonal(
  params: SearchParams,
  apiUrl: string,
  dbId: string
): Promise<any> {
  if (!apiUrl) {
    throw new Error('apiUrl is not defined')
  }

  if (!dbId) {
    throw new Error('dbId is not defined')
  }

  const headers: any = {
    'Content-Type': 'application/json'
  }

  const ancestorId = idToUuid(dbId)

  const body = {
    type: 'BlocksInAncestor',
    query: params.query,
    ancestorId: ancestorId,
    source: 'quick_find_input_change',
    sort: {
      field: 'relevance'
    },
    limit: params.limit || 100,
    filters: {
      isDeletedOnly: false,
      excludeTemplates: false,
      navigableBlockContentOnly: false,
      requireEditPermissions: false,
      includePublicPagesWithoutExplicitAccess: true,
      ancestors: [],
      createdBy: [],
      editedBy: [],
      lastEditedTime: {},
      createdTime: {},
      inTeams: [],
      ...params.filters
    }
  }

  const url = `${apiUrl}/search`

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Notion search API error: ${response.status} - ${text}`)
  }

  const personalSearchData = await response.json()
  if (personalSearchData?.recordMap) {
    personalSearchData.recordMap = normalizeRecordMap(personalSearchData.recordMap)
  }
  return personalSearchData
}
