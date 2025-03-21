import { Book, NotionPost, NotionTagData, Tag, Tool } from '@/src/interface'
import { NotionSorts, Post } from '@notion-x/src/interface'
import { getCustomEmojiBlock, getUnofficialDatabase, queryDatabase } from '@notion-x/src/lib/db'
import { getJoinedRichText, makeSlugText } from '@notion-x/src/lib/helpers'
import { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints'
import { get } from 'lodash'
import { Block, CollectionInstance } from 'notion-types'

import { defaultPostDate, defaultPostTitle } from './config'
import { getFilter, getUri, transformUnofficialPostProps } from './helpers'

export async function getUnofficialPosts() {
  try {
    const data = await getUnofficialDatabase({
      spaceId: process.env.SPACE_ID,
      sourceId: process.env.SOURCE_ID,
      collectionViewId: process.env.COLLECTION_VIEW_ID,
      notionTokenV2: process.env.NOTION_TOKEN_V2,
      notionActiveUser: process.env.NOTION_ACTIVE_USER,
      notionApiWeb: process.env.NOTION_API_WEB
    })
    return transformUnofficialPosts(data)
  } catch (error) {
    console.error('🚨 Error in getUnofficialPosts()', error)
    return []
  }
}

export async function getPosts(options: {
  filter?: QueryDatabaseParameters['filter']
  startCursor?: string
  pageSize?: number
  sorts?: NotionSorts[]
}): Promise<Post[]> {
  if (!process.env.NOTION_DB_POSTS) throw new Error('getPosts(): NOTION_DB_POSTS is not defined')
  const { filter, startCursor, pageSize, sorts } = options

  try {
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
      sorts: sortsToUse
    })

    return await transformNotionPostsData({ data: data?.results as any[] })
  } catch (error) {
    console.error('🚨 Error in getPosts()', error)
    return []
  }
}

export async function getCustomEmojiUrl(customEmojiId: string) {
  try {
    const data = await getCustomEmojiBlock({
      customEmojiId,
      apiUrl: process.env.NOTION_API_WEB,
      tokenV2: process.env.NOTION_TOKEN_V2,
      activeUser: process.env.NOTION_ACTIVE_USER
    })
    return data?.url ?? ''
  } catch (error) {
    console.error('🚨 Error in getCustomEmojiUrl()', error)
    return ''
  }
}

export async function getUnofficialBooks() {
  try {
    const data = await getUnofficialDatabase({
      spaceId: process.env.SPACE_ID,
      sourceId: process.env.READING_SOURCE_ID,
      collectionViewId: process.env.READING_COLLECTION_VIEW_ID,
      notionTokenV2: process.env.NOTION_TOKEN_V2,
      notionActiveUser: process.env.NOTION_ACTIVE_USER,
      notionApiWeb: process.env.NOTION_API_WEB
    })
    return { books: transformUnofficialBooks(data) }
  } catch (error) {
    console.error('🚨 Error in getUnofficialBooks()', error)
    return { books: [] }
  }
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
        hide
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

export async function getUnofficialTools() {
  try {
    const data = await getUnofficialDatabase({
      spaceId: process.env.SPACE_ID,
      sourceId: process.env.TOOLS_SOURCE_ID,
      collectionViewId: process.env.TOOLS_COLLECTION_VIEW_ID,
      notionTokenV2: process.env.NOTION_TOKEN_V2,
      notionActiveUser: process.env.NOTION_ACTIVE_USER,
      notionApiWeb: process.env.NOTION_API_WEB
    })
    const allTags = getAllToolsTags(data)
    const allCategories = getAllToolsCategories(data)
    return { tools: transformUnofficialTools(data), tags: allTags, categories: allCategories }
  } catch (error) {
    console.error('🚨 Error in getUnofficialTools', error)
    return { tools: [], tags: [] }
  }
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

export async function getTopics() {
  try {
    const data = await getUnofficialDatabase({
      spaceId: process.env.SPACE_ID,
      sourceId: process.env.TOPICS_SOURCE_ID,
      collectionViewId: process.env.TOPICS_COLLECTION_VIEW_ID,
      notionTokenV2: process.env.NOTION_TOKEN_V2,
      notionActiveUser: process.env.NOTION_ACTIVE_USER,
      notionApiWeb: process.env.NOTION_API_WEB
    })
    return transformTopics(data)
  } catch (error) {
    console.error('🚨 Error in getTopics()', error)
    return []
  }
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
      const id = get(post, 'id') as string

      // title
      const title = getJoinedRichText(get(post, 'properties.Name.title') as any) || defaultPostTitle

      // description
      const description = getJoinedRichText(get(post, 'properties.description.rich_text') as any)

      // date
      const gotDate = get(
        post,
        'properties.finalModified.formula.date.start',
        get(post, 'last_edited_time', defaultPostDate)
      )
      const date = new Date(gotDate).toISOString()

      // createdDate
      const createdDate = new Date(
        get(post, 'properties.createdDate.date.start', get(post, 'created_time', defaultPostDate))
      ).toISOString()

      // Tags
      const tags =
        post.properties?.tags?.multi_select?.map((tag: NotionTagData) => mapTag(tag)) || []

      // slug
      const slug =
        get(post, 'properties.slug.rich_text[0].plain_text', '') ||
        makeSlugText(getJoinedRichText(post?.properties?.Name?.title as any))

      // isDraft
      const isDraft = get(post, 'properties.draft.checkbox') || false

      // wellWritten
      const wellWritten = get(post, 'properties.wellWritten.checkbox') || false

      // pinned
      const pinned = get(post, 'properties.pinned.checkbox') || false

      // blog
      const blog = get(post, 'properties.blog.checkbox') || false

      // hide
      const hide = get(post, 'properties.hide.checkbox') || false

      // published
      const isPublished = get(post, 'properties.published.checkbox') || false

      // language
      const language = get(post, 'properties.language.select.name') || 'en'

      // vi
      // Note: this one just make sure vi is not null or empty string! It's not what we want (slug)
      // The slug is actually used in transformUnofficialPostProps() for the header of the post
      const vi = get(post, 'properties.vi.rich_text[0]') || ''

      // en
      // Note: this one just make sure vi is not null or empty string! It's not what we want (slug)
      // The slug is actually used in transformUnofficialPostProps() for the header of the post
      const en = get(post, 'properties.en.rich_text[0]') || ''

      // fr
      // Note: this one just make sure vi is not null or empty string! It's not what we want (slug)
      // The slug is actually used in transformUnofficialPostProps() for the header of the post
      const fr = get(post, 'properties.fr.rich_text[0]') || ''

      // notionUrl
      const notionUrl = get(post, 'properties.notionURL.formula.string') || ''

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
        wellWritten,
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
