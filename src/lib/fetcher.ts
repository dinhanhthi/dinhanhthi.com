import { getJoinedRichText, makeSlugText } from '@/src/lib/helpers'
import {
  getBlocksByIds,
  getCustomEmojiBlock,
  getPage,
  getUnofficialDatabase,
  queryDatabase
} from '@/src/lib/notion/db'
import { Book, NotionPost, NotionSorts, NotionTagData, Post, Tag, Tool } from '@/src/lib/types'
import { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints'
import _ from 'lodash'
import { Block, CollectionInstance, ExtendedRecordMap } from 'notion-types'

import { getFilter, getUri, transformUnofficialPostProps } from '@/src/lib/helpers'
import { defaultPostDate, defaultPostTitle, redisCacheTTL } from './config'
import { withRedisCache } from './redis-cache'

export async function getUnofficialPosts(opts?: {
  whoIsCalling?: string
  forceRefresh?: boolean
  uri?: string
}) {
  const { whoIsCalling, forceRefresh, uri } = opts || {}
  return withRedisCache(
    'unofficial-posts',
    async () => {
      const data = await getUnofficialDatabase({
        spaceId: process.env.SPACE_ID,
        sourceId: process.env.SOURCE_ID,
        collectionViewId: process.env.COLLECTION_VIEW_ID,
        notionApiWeb: process.env.NOTION_API_PUBLISHED,
        whoIsCalling: whoIsCalling
          ? `${whoIsCalling} -> getUnofficialPosts`
          : 'fetcher.ts/getUnofficialPosts',
        uri
      })
      return transformUnofficialPosts(data)
    },
    {
      namespace: 'notion',
      whoIsCalling: whoIsCalling
        ? `${whoIsCalling} -> getUnofficialPosts`
        : 'fetcher.ts/getUnofficialPosts',
      ...redisCacheTTL.unofficialPosts,
      forceRefresh
    }
  )
}

export async function getPosts(options: {
  filter?: QueryDatabaseParameters['filter']
  startCursor?: string
  pageSize?: number
  sorts?: NotionSorts[]
  whoIsCalling?: string
  forceRefresh?: boolean
  uri?: string
}): Promise<Post[]> {
  if (!process.env.NOTION_DB_POSTS) throw new Error('getPosts(): NOTION_DB_POSTS is not defined')
  const { filter, startCursor, pageSize, sorts, whoIsCalling, forceRefresh, uri } = options

  // Create a unique cache key based on the options
  const cacheKey = `posts-${JSON.stringify({ filter, startCursor, pageSize, sorts })}`

  return withRedisCache(
    cacheKey,
    async () => {
      const defaultSort = {
        property: 'finalModified',
        direction: 'descending'
      } as NotionSorts

      const sortsToUse: any = sorts?.length ? sorts.push(defaultSort) : [defaultSort]
      const filterToUse = getFilter(filter)

      const data = await queryDatabase({
        dbId: process.env.NOTION_DB_POSTS as string,
        filter: filterToUse,
        startCursor,
        pageSize,
        sorts: sortsToUse,
        whoIsCalling: whoIsCalling ? `${whoIsCalling} -> getPosts` : 'fetcher.ts/getPosts',
        uri
      })

      return await transformNotionPostsData({ data: data?.results as any[] })
    },
    {
      namespace: 'notion',
      whoIsCalling: whoIsCalling ? `${whoIsCalling} -> getPosts` : 'fetcher.ts/getPosts',
      ...redisCacheTTL.posts,
      forceRefresh
    }
  )
}

export async function getCustomEmojiUrl(
  pageWithDash: string,
  customEmojiId: string,
  opts?: { whoIsCalling?: string; uri?: string }
) {
  const { whoIsCalling, uri } = opts || {}
  const cacheKey = `emoji-${pageWithDash}-${customEmojiId}`

  return withRedisCache(
    cacheKey,
    async () => {
      const data = await getCustomEmojiBlock({
        pageWithDash,
        customEmojiId,
        apiUrl: process.env.NOTION_API_PUBLISHED
      })
      return data?.url ?? ''
    },
    {
      namespace: 'notion',
      whoIsCalling: whoIsCalling
        ? `${whoIsCalling} -> getCustomEmojiUrl`
        : 'fetcher.ts/getCustomEmojiUrl',
      uri,
      ...redisCacheTTL.emoji
    }
  )
}

export async function getUnofficialBooks(opts?: {
  whoIsCalling?: string
  forceRefresh?: boolean
  uri?: string
}) {
  const { whoIsCalling, forceRefresh, uri } = opts || {}
  return withRedisCache(
    'unofficial-books',
    async () => {
      const data = await getUnofficialDatabase({
        spaceId: process.env.SPACE_ID,
        sourceId: process.env.READING_SOURCE_ID,
        collectionViewId: process.env.READING_COLLECTION_VIEW_ID,
        notionApiWeb: process.env.NOTION_API_PUBLISHED,
        whoIsCalling: whoIsCalling
          ? `${whoIsCalling} -> getUnofficialBooks`
          : 'fetcher.ts/getUnofficialBooks',
        uri
      })
      return { books: transformUnofficialBooks(data) }
    },
    {
      namespace: 'notion',
      whoIsCalling: whoIsCalling
        ? `${whoIsCalling} -> getUnofficialBooks`
        : 'fetcher.ts/getUnofficialBooks',
      ...redisCacheTTL.books,
      forceRefresh
    }
  )
}

function transformUnofficialBooks(data: CollectionInstance): Book[] {
  const _block = data?.recordMap?.block
  const bookIds = Object.keys(_block)
  const books = [] as Book[]

  for (const id of bookIds) {
    const tool = _block[id]
    const properties = tool?.value?.properties

    const iconUrl = properties?.[`${process.env.READING_COVER_KEY}`]?.[0]?.[1]?.[0]?.[1]
    if (!iconUrl) continue // because there are useless blocks in the database
    const name = properties?.title?.[0]?.[0]
    const author = properties?.[`${process.env.READING_AUTHOR_KEY}`]?.[0]?.[0]
    const description = properties?.[`${process.env.READING_DESC_KEY}`]?.[0]?.[0]
    const star = properties?.[`${process.env.READING_STAR_KEY}`]?.[0]?.[0]
    const isReading = properties?.[`${process.env.READING_IS_READING_KEY}`]?.[0]?.[0] === 'Yes'
    const tags = properties?.[`${process.env.READING_TAG_KEY}`]?.[0]?.[0]?.split(',')
    const url = properties?.[`${process.env.READING_GOODREADS_KEY}`]?.[0]?.[0]
    const createdTime = new Date(tool?.value?.created_time)?.toISOString()
    const keySearch = properties?.[`${process.env.READING_KEYSEARCH_KEY}`]?.[0]?.[0]
    const date =
      properties?.[`${process.env.READING_READ_DATE_KEY}`]?.[0]?.[1]?.[0]?.[1]?.['start_date'] ??
      createdTime
    const block = tool?.value as Block
    const favorite = star === '5'
    const hide = properties?.[`${process.env.READING_HIDE_KEY}`]?.[0]?.[0] === 'Yes'
    const isOthers = properties?.[`${process.env.READING_OTHERS_KEY}`]?.[0]?.[0] === 'Yes'

    if (star === '5') tags.unshift('favorite')

    if (!hide) {
      books.push({
        id,
        name,
        author,
        star,
        description,
        iconUrl,
        tags,
        url,
        date,
        isReading,
        block,
        favorite,
        keySearch,
        hide,
        isOthers
      })
    }
  }

  return books.sort(function (a, b) {
    const keyA = new Date(a.date)
    const keyB = new Date(b.date)
    if (keyA < keyB) return 1
    if (keyA > keyB) return -1
    return 0
  })
}

export async function getUnofficialTools(opts?: {
  whoIsCalling?: string
  forceRefresh?: boolean
  uri?: string
}) {
  const { whoIsCalling, forceRefresh, uri } = opts || {}
  return withRedisCache(
    'unofficial-tools',
    async () => {
      const data = await getUnofficialDatabase({
        spaceId: process.env.SPACE_ID,
        sourceId: process.env.TOOLS_SOURCE_ID,
        collectionViewId: process.env.TOOLS_COLLECTION_VIEW_ID,
        notionApiWeb: process.env.NOTION_API_PUBLISHED,
        whoIsCalling: whoIsCalling
          ? `${whoIsCalling} -> getUnofficialTools`
          : 'fetcher.ts/getUnofficialTools',
        uri
      })
      const allTags = getAllToolsTags(data)
      const allCategories = getAllToolsCategories(data)
      return { tools: transformUnofficialTools(data), tags: allTags, categories: allCategories }
    },
    {
      namespace: 'notion',
      whoIsCalling: whoIsCalling
        ? `${whoIsCalling} -> getUnofficialTools`
        : 'fetcher.ts/getUnofficialTools',
      ...redisCacheTTL.tools,
      forceRefresh
    }
  )
}

function getAllToolsTags(data: CollectionInstance): string[] {
  return (
    data?.recordMap?.collection?.[`${process.env.TOOLS_SOURCE_ID}`]?.value?.schema?.[
      `${process.env.TOOLS_TAG_KEY}`
    ]?.options?.map((option: any) => option.value) ?? []
  )
}

function getAllToolsCategories(data: CollectionInstance): string[] {
  return (
    data?.recordMap?.collection?.[`${process.env.TOOLS_SOURCE_ID}`]?.value?.schema?.[
      `${process.env.TOOLS_CATEGORY_KEY}`
    ]?.options?.map((option: any) => option.value) ?? []
  )
}

function transformUnofficialTools(data: CollectionInstance): Tool[] {
  const _block = data?.recordMap?.block
  const toolIds = Object.keys(_block)
  const tools = [] as Tool[]

  for (const id of toolIds) {
    const tool = _block[id]
    const properties = tool?.value?.properties
    const iconUrl = properties?.[`${process.env.TOOLS_ICON_KEY}`]?.[0]?.[1]?.[0]?.[1]
    if (!iconUrl) continue // because there are useless blocks in the database
    const name = properties?.title?.[0]?.[0]
    const description = properties?.[`${process.env.TOOLS_DESC_KEY}`]?.[0]?.[0]
    const shortDescription = properties?.[`${process.env.TOOLS_SHORT_DESC_KEY}`]?.[0]?.[0]
    const isFree = properties?.[`${process.env.TOOLS_FREE_KEY}`]?.[0]?.[0] === 'Yes'
    const tags = properties?.[`${process.env.TOOLS_TAG_KEY}`]?.[0]?.[0]?.split(',')
    const category = properties?.[`${process.env.TOOLS_CATEGORY_KEY}`]?.[0]?.[0]
    const url = properties?.[`${process.env.TOOLS_URL_KEY}`]?.[0]?.[0]
    const date = new Date(tool?.value?.created_time)?.toISOString()
    const block = tool?.value as Block
    const keySearch = properties?.[`${process.env.TOOLS_KEYSEARCH_KEY}`]?.[0]?.[0]
    const hide = properties?.[`${process.env.TOOLS_HIDE_KEY}`]?.[0]?.[0] === 'Yes'
    const favorite = properties?.[`${process.env.TOOLS_FAVORITE_KEY}`]?.[0]?.[0] === 'Yes'

    if (!hide) {
      tools.push({
        id,
        name,
        description,
        shortDescription,
        url,
        iconUrl,
        isFree,
        tags,
        category,
        date,
        block,
        keySearch,
        favorite
      })
    }
  }

  return tools.sort(function (a, b) {
    const keyA = new Date(a.date)
    const keyB = new Date(b.date)
    if (keyA < keyB) return 1
    if (keyA > keyB) return -1
    return 0
  })
}

export async function getTopics(opts?: {
  whoIsCalling?: string
  forceRefresh?: boolean
  uri?: string
}) {
  const { whoIsCalling, forceRefresh, uri } = opts || {}
  return withRedisCache(
    'topics',
    async () => {
      const data = await getUnofficialDatabase({
        spaceId: process.env.SPACE_ID,
        sourceId: process.env.TOPICS_SOURCE_ID,
        collectionViewId: process.env.TOPICS_COLLECTION_VIEW_ID,
        notionApiWeb: process.env.NOTION_API_PUBLISHED,
        whoIsCalling: whoIsCalling ? `${whoIsCalling} -> getTopics` : 'fetcher.ts/getTopics',
        uri
      })
      return transformTopics(data)
    },
    {
      namespace: 'notion',
      whoIsCalling: whoIsCalling ? `${whoIsCalling} -> getTopics` : 'fetcher.ts/getTopics',
      ...redisCacheTTL.topics,
      forceRefresh
    }
  )
}

function transformTopics(data: CollectionInstance): Tag[] {
  const block = data?.recordMap?.block
  const topicIds = Object.keys(block)
  const topics = [] as Tag[]

  for (const _id of topicIds) {
    const topic = block[_id]
    const properties = topic?.value?.properties

    const iconUrl = properties?.[`${process.env.TOPICS_ICON_KEY}`]?.[0]?.[0]
    if (!properties) continue // because there are useless blocks in the database
    const name = properties?.title?.[0]?.[0]
    const description = properties?.[`${process.env.TOPICS_DESC_KEY}`]?.[0]?.[0]
    const pinned = properties?.[`${process.env.TOPICS_PINNED_KEY}`]?.[0]?.[0] === 'Yes'
    const hide = properties?.[`${process.env.TOPICS_HIDE_KEY}`]?.[0]?.[0] === 'Yes'
    const className = properties?.[`${process.env.TOPICS_CLASSNAME_KEY}`]?.[0]?.[0]
    const longName = properties?.[`${process.env.TOPICS_LONG_NAME_KEY}`]?.[0]?.[0]

    topics.push({
      id: makeSlugText(name),
      name,
      description,
      slug: makeSlugText(name),
      uri: getUri('tag', makeSlugText(name)),
      iconUrl,
      pinned,
      hide,
      className,
      longName
    })
  }

  return topics.sort(function (a, b) {
    return a.name > b.name ? 1 : b.name > a.name ? -1 : 0
  })
}

function transformUnofficialPosts(data: CollectionInstance): Post[] {
  const block = data?.recordMap?.block
  const postIds = Object.keys(block)
  const posts = []
  for (const id of postIds) {
    const post = block[id]
    const properties = post?.value?.properties
    const slug = properties?.[`${process.env.NEXT_PUBLIC_ID_SLUG}`]?.[0]?.[0]
    if (!slug) continue

    posts.push(transformUnofficialPostProps(post?.value))
  }

  return posts
    .filter(post => !post.hide)
    .filter(
      post =>
        (process.env.ENV_MODE === 'prod' && post.isPublished) || process.env.ENV_MODE !== 'prod'
    )
}

function mapTag(tag: NotionTagData): Tag {
  if (!tag || !tag.name) throw new Error('tag is invalid')
  return {
    id: makeSlugText(tag.name),
    name: tag.name,
    slug: makeSlugText(tag.name),
    uri: getUri('tag', makeSlugText(tag.name))
  }
}

async function transformNotionPostsData(options: { data: NotionPost[] }): Promise<Post[]> {
  const { data } = options
  if (!data || !data.length) return []
  return Promise.all(
    data?.map(async post => {
      // id
      const id = _.get(post, 'id') as string

      // title
      const title =
        getJoinedRichText(_.get(post, 'properties.Name.title') as any) || defaultPostTitle

      // description
      const description = getJoinedRichText(_.get(post, 'properties.description.rich_text') as any)

      // date
      const gotDate = _.get(
        post,
        'properties.finalModified.formula.date.start',
        _.get(post, 'last_edited_time', defaultPostDate)
      )
      const date = new Date(gotDate).toISOString()

      // createdDate
      const createdDate = new Date(
        _.get(
          post,
          'properties.createdDate.date.start',
          _.get(post, 'created_time', defaultPostDate)
        )
      ).toISOString()

      // Tags
      const tags =
        post.properties?.tags?.multi_select?.map((tag: NotionTagData) => mapTag(tag)) || []

      // slug
      const slug =
        _.get(post, 'properties.slug.rich_text[0].plain_text', '') ||
        makeSlugText(getJoinedRichText(post?.properties?.Name?.title as any))

      // isDraft
      const isDraft = _.get(post, 'properties.draft.checkbox') || false

      // pinned
      const pinned = _.get(post, 'properties.pinned.checkbox') || false

      // blog
      const blog = _.get(post, 'properties.blog.checkbox') || false

      // hide
      const hide = _.get(post, 'properties.hide.checkbox') || false

      // published
      const isPublished = _.get(post, 'properties.published.checkbox') || false

      // language
      const language = _.get(post, 'properties.language.select.name') || 'en'

      // vi
      // Note: this one just make sure vi is not null or empty string! It's not what we want (slug)
      // The slug is actually used in transformUnofficialPostProps() for the header of the post
      const vi = _.get(post, 'properties.vi.rich_text[0]') || ''

      // en
      // Note: this one just make sure vi is not null or empty string! It's not what we want (slug)
      // The slug is actually used in transformUnofficialPostProps() for the header of the post
      const en = _.get(post, 'properties.en.rich_text[0]') || ''

      // fr
      // Note: this one just make sure vi is not null or empty string! It's not what we want (slug)
      // The slug is actually used in transformUnofficialPostProps() for the header of the post
      const fr = _.get(post, 'properties.fr.rich_text[0]') || ''

      // notionUrl
      const notionUrl = _.get(post, 'properties.notionURL.formula.string') || ''

      return {
        id,
        title,
        description,
        slug,
        uri: getUri('note', slug),
        date,
        createdDate,
        tags,
        isDraft,
        pinned,
        blog,
        hide,
        isPublished,
        language,
        vi,
        en,
        fr,
        notionUrl
      } as Post
    })
  )
}

/**
 * ========================================================================
 * Record Map Fetcher - Fetches Notion page with missing blocks fixed
 * ========================================================================
 * This function fetches a Notion page (recordMap) and fixes any missing
 * blocks that might be referenced but not included in the initial fetch.
 */

export async function getRecordMap(
  pageId: string,
  opts?: { whoIsCalling?: string; forceRefresh?: boolean; uri?: string }
) {
  const { whoIsCalling, forceRefresh, uri } = opts || {}
  return withRedisCache(
    `page-${pageId}`,
    async () => {
      const recordMap = await getPage(pageId)
      const newRecordMap = await fixMissingBlocks(recordMap)
      return newRecordMap
    },
    {
      namespace: 'notion',
      whoIsCalling: whoIsCalling ? `${whoIsCalling} -> getRecordMap` : 'fetcher.ts/getRecordMap',
      uri,
      ...redisCacheTTL.recordMap,
      forceRefresh
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
  const missingBlocks = brokenBlockIds?.length ? await getBlocksByIds(brokenBlockIds) : null
  const newBlocks = {
    ...recordMap.block,
    ...missingBlocks?.recordMap?.block
  }
  return {
    ...recordMap,
    block: newBlocks
  }
}
