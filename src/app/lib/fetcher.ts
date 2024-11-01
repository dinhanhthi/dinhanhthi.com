import {
  Book,
  BookmarkItem,
  Game,
  NotionBookmarkItem,
  NotionPost,
  NotionTagData,
  Tag,
  Tool
} from '@/src/interface'
import { NotionSorts, Post } from '@notion-x/src/interface'
import { getUnofficialDatabase, queryDatabase } from '@notion-x/src/lib/db'
import { getJoinedRichText, makeSlugText } from '@notion-x/src/lib/helpers'
import { Client } from '@notionhq/client'
import { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints'
import { get } from 'lodash'
import { Block, CollectionInstance } from 'notion-types'
import urlMetadata from 'url-metadata'

import { Project } from '../components/ProjectItem'
import { defaultPostDate, defaultPostTitle } from './config'
import { getFilter, getPostProperties, getUri } from './helpers'

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

export async function getUnofficialBookmarks() {
  try {
    const data = await getUnofficialDatabase({
      spaceId: process.env.SPACE_ID,
      sourceId: process.env.BOOKMARKS_SOURCE_ID,
      collectionViewId: process.env.BOOKMARKS_COLLECTION_VIEW_ID,
      notionTokenV2: process.env.NOTION_TOKEN_V2,
      notionActiveUser: process.env.NOTION_ACTIVE_USER,
      notionApiWeb: process.env.NOTION_API_WEB
    })
    const bookmarks = await transformUnofficialBookmarks(data)
    const tags = getAllBookmarksTags(data)
    return { bookmarks, tags }
  } catch (error) {
    console.error('🚨 Error in getUnofficialBookmarks()', error)
    return { bookmarks: [], tags: [] }
  }
}

function getAllBookmarksTags(data: CollectionInstance): string[] {
  return (
    data?.recordMap?.collection?.[`${process.env.BOOKMARKS_SOURCE_ID}`]?.value?.schema?.[
      `${process.env.BOOKMARKS_TAGS_KEY}`
    ]?.options?.map((option: any) => option.value) ?? []
  )
}

async function transformUnofficialBookmarks(data: CollectionInstance): Promise<BookmarkItem[]> {
  const block = data?.recordMap?.block
  const markIds = Object.keys(block)
  const marks = [] as BookmarkItem[]

  await Promise.all(
    markIds.map(async id => {
      const mark = block[id]
      const properties = mark?.value?.properties
      const url = properties?.[`${process.env.BOOKMARKS_URL_KEY}`]?.[0]?.[0] || null

      if (!url) return

      const createdTime = data.recordMap?.block?.[id]?.value?.created_time || '2020-01-01'
      const _title = properties?.title?.[0]?.[0] || null
      const _description = properties?.[`${process.env.BOOKMARKS_DESC_KEY}`]?.[0]?.[0] || null
      const _coverUrl = properties?.[`${process.env.BOOKMARKS_COVER_URL_KEY}`]?.[0]?.[0] || null

      const tags = properties?.[`${process.env.BOOKMARKS_TAGS_KEY}`]?.[0]?.[0]?.split(',') || []
      const pinned = properties?.[`${process.env.BOOKMARKS_PINNED_KEY}`]?.[0]?.[0] === 'Yes'
      const favorite = properties?.[`${process.env.BOOKMARKS_FAVORITE_KEY}`]?.[0]?.[0] === 'Yes'
      const keySearch = properties?.[`${process.env.BOOKMARKS_KEYSEARCH_KEY}`]?.[0]?.[0] || null

      // Auto add tag "favorite" if it's marked as favorite
      if (favorite && !tags.includes('favorite')) tags.push('favorite')

      let __title: string | undefined
      let __description: string | undefined
      let __coverUrl: string | undefined

      if (!_title && !_description) {
        const fetchedMeta = await getBookmarkMetadataAndUpdateNotion(url, id)
        __title = fetchedMeta.title
        __description = fetchedMeta.description
        __coverUrl = fetchedMeta.coverUrl
      }

      marks.push({
        id,
        createdTime: new Date(createdTime).toISOString(),
        title: _title || __title,
        description: _description || __description,
        url,
        coverUrl: _coverUrl || __coverUrl,
        tags,
        pinned,
        favorite,
        keySearch
      })
    })
  )

  return marks.sort(function (a, b) {
    const keyA = new Date(a.createdTime)
    const keyB = new Date(b.createdTime)
    if (keyA < keyB) return 1
    if (keyA > keyB) return -1
    return 0
  })
}

// Unused
export async function getBookmarks(options: {
  startCursor?: string
  pageSize?: number
}): Promise<BookmarkItem[]> {
  if (!process.env.DB_BOOKMARKS) throw new Error('getPosts(): DB_BOOKMARKS is not defined')
  const { startCursor, pageSize } = options

  try {
    const data = await queryDatabase({
      dbId: process.env.DB_BOOKMARKS as string,
      startCursor,
      pageSize,
      sorts: [
        {
          property: 'Created time',
          direction: 'descending'
        }
      ]
    })

    return await transformNotionBookmarksData(data?.results as any[])
  } catch (error) {
    console.error('🚨 Error in getBookmarks()', error)
    return []
  }
}

async function transformNotionBookmarksData(data: NotionBookmarkItem[]): Promise<BookmarkItem[]> {
  if (!data || !data.length) return []
  return Promise.all(
    data?.map(async bookmark => {
      // id
      const id = bookmark.id

      // url
      const url = bookmark.properties.url.url

      // createdTime
      const createdTime = bookmark.created_time

      // title
      const _title = bookmark.properties?.title?.title[0]?.plain_text

      // description
      const _description = getJoinedRichText(bookmark.properties?.description?.rich_text as any)

      // cover
      const _coverUrl = bookmark.properties?.coverUrl?.url

      let __title: string | undefined
      let __description: string | undefined
      let __coverUrl: string | undefined
      if (!_title || !_description || !_title.length || !_description.length) {
        const fetchedMeta = await getBookmarkMetadataAndUpdateNotion(url, id)
        __title = fetchedMeta.title
        __description = fetchedMeta.description
        __coverUrl = fetchedMeta.coverUrl
      }

      return {
        id,
        url,
        createdTime,
        title: _title || __title,
        description: _description || __description,
        coverUrl: _coverUrl || __coverUrl
      } as BookmarkItem
    })
  )
}

async function getBookmarkMetadataAndUpdateNotion(
  url: string,
  id: string
): Promise<Pick<BookmarkItem, 'title' | 'description' | 'coverUrl'>> {
  const metadata = await urlMetadata(url)

  const title = metadata?.title as string
  const description = metadata?.description as string
  const coverUrl = (metadata?.['og:image'] || metadata?.image) as string

  try {
    await updateBookmarkOnNotion(id, { title, description, coverUrl })
  } catch (error) {
    console.error('🚨 Error in updateBookmarkOnNotion()', error)
  }

  return { title, description, coverUrl }
}

async function updateBookmarkOnNotion(
  markId: string,
  options: Pick<BookmarkItem, 'title' | 'description' | 'coverUrl'>
) {
  const { title, description, coverUrl } = options

  if (!title && !description && !coverUrl) return null

  const notion = new Client({ auth: process.env.NOTION_TOKEN })
  const promises = [] as Promise<any>[]

  if (title) {
    promises.push(
      notion.pages.update({
        page_id: markId,
        properties: {
          title: { title: [{ type: 'text', text: { content: title } }] }
        }
      })
    )
  }

  if (description) {
    promises.push(
      notion.pages.update({
        page_id: markId,
        properties: {
          description: {
            rich_text: [{ type: 'text', text: { content: description } }]
          }
        }
      })
    )
  }

  if (coverUrl) {
    promises.push(
      notion.pages.update({
        page_id: markId,
        properties: { coverUrl: { url: coverUrl } }
      })
    )
  }

  return Promise.all(promises)
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

    if (star === '5') tags.unshift('favorite')

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
      keySearch
    })
  }

  return books.sort(function (a, b) {
    const keyA = new Date(a.date)
    const keyB = new Date(b.date)
    if (keyA < keyB) return 1
    if (keyA > keyB) return -1
    return 0
  })
}

export async function getUnofficialGames() {
  try {
    const data = await getUnofficialDatabase({
      spaceId: process.env.SPACE_ID,
      sourceId: process.env.GAMES_SOURCE_ID,
      collectionViewId: process.env.GAMES_COLLECTION_VIEW_ID,
      notionTokenV2: process.env.NOTION_TOKEN_V2,
      notionActiveUser: process.env.NOTION_ACTIVE_USER,
      notionApiWeb: process.env.NOTION_API_WEB
    })
    return { games: transformUnofficialGames(data) }
  } catch (error) {
    console.error('🚨 Error in getUnofficialGames', error)
    return { games: [] }
  }
}

function transformUnofficialGames(data: CollectionInstance): Game[] {
  const _block = data?.recordMap?.block
  const toolIds = Object.keys(_block)
  const games = [] as Game[]

  for (const id of toolIds) {
    const tool = _block[id]
    const properties = tool?.value?.properties

    const iconUrl = properties?.[`${process.env.GAMES_ICON_KEY}`]?.[0]?.[1]?.[0]?.[1]
    if (!iconUrl) continue // because there are useless blocks in the database
    const name = properties?.title?.[0]?.[0]
    const description = properties?.[`${process.env.GAMES_DESC_KEY}`]?.[0]?.[0]
    const isFree = properties?.[`${process.env.GAMES_FREE_KEY}`]?.[0]?.[0] === 'Yes'
    const favorite = properties?.[`${process.env.GAMES_FAVORITE_KEY}`]?.[0]?.[0] === 'Yes'
    const tags = properties?.[`${process.env.GAMES_TAG_KEY}`]?.[0]?.[0]?.split(',')
    const url = properties?.[`${process.env.GAMES_URL_KEY}`]?.[0]?.[0]
    const createdTime = new Date(tool?.value?.created_time)?.toISOString()
    const playedDate =
      properties?.[`${process.env.GAMES_PLAYED_DATE_KEY}`]?.[0]?.[1]?.[0]?.[1]?.start_date
    const date = playedDate || createdTime
    const block = tool?.value as Block
    const keySearch = properties?.[`${process.env.GAMES_KEYSEARCH_KEY}`]?.[0]?.[0]

    if (favorite && !tags.includes('favorite')) tags.unshift('favorite')

    games.push({
      id,
      name,
      description,
      url,
      iconUrl,
      isFree,
      tags,
      block,
      keySearch,
      favorite,
      date
    })
  }

  return games.sort(function (a, b) {
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
    return { tools: transformUnofficialTools(data), tags: allTags }
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
    const isFree = properties?.[`${process.env.TOOLS_FREE_KEY}`]?.[0]?.[0] === 'Yes'
    const tags = properties?.[`${process.env.TOOLS_TAG_KEY}`]?.[0]?.[0]?.split(',')
    const url = properties?.[`${process.env.TOOLS_URL_KEY}`]?.[0]?.[0]
    const date = new Date(tool?.value?.created_time)?.toISOString()
    const block = tool?.value as Block
    const keySearch = properties?.[`${process.env.TOOLS_KEYSEARCH_KEY}`]?.[0]?.[0]

    tools.push({
      id,
      name,
      description,
      url,
      iconUrl,
      isFree,
      tags,
      date,
      block,
      keySearch
    })
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

export async function getUnofficialProjects() {
  try {
    const data = await getUnofficialDatabase({
      spaceId: process.env.SPACE_ID,
      sourceId: process.env.PROJECTS_SOURCE_ID,
      collectionViewId: process.env.PROJECTS_COLLECTION_VIEW_ID,
      notionTokenV2: process.env.NOTION_TOKEN_V2,
      notionActiveUser: process.env.NOTION_ACTIVE_USER,
      notionApiWeb: process.env.NOTION_API_WEB
    })
    return transformUnofficialProjects(data)
  } catch (error) {
    console.error('🚨 Error in getProjects()', error)
    return []
  }
}

function transformUnofficialProjects(data: CollectionInstance): Project[] {
  const _block = data?.recordMap?.block
  const projectIds = Object.keys(_block)
  const projects = [] as Project[]

  for (const id of projectIds) {
    const project = _block[id]
    const properties = project?.value?.properties
    const description = properties?.[`${process.env.PROJECTS_DESC_KEY}`]?.[0]?.[0]
    if (!description) continue // because there are useless blocks in the database
    const type = properties?.[`${process.env.PROJECTS_TYPE_KEY}`]?.[0]?.[0]?.split(',')
    const title = properties?.title?.[0]?.[0]
    const tech = properties?.[`${process.env.PROJECTS_TECH_KEY}`]?.[0]?.[0]?.split(',')
    const source = properties?.[`${process.env.PROJECTS_SOURCE_KEY}`]?.[0]?.[0]
    const url = properties?.[`${process.env.PROJECTS_URL_KEY}`]?.[0]?.[0]
    const techText = properties?.[`${process.env.PROJECTS_TECH_TEXT_KEY}`]?.[0]?.[0]?.split(',')
    const choice = properties?.[`${process.env.PROJECTS_CHOICE_KEY}`]?.[0]?.[0] === 'Yes'
    const icon = project?.value?.format?.page_icon
    const lastModified =
      properties?.[`${process.env.PROJECTS_LAST_MODIFIED_KEY}`]?.[0]?.[1]?.[0]?.[1]?.start_date ??
      new Date(project?.value?.last_edited_time).toISOString()
    const block = project?.value as Block

    projects.push({
      id,
      title,
      description,
      type,
      tech,
      source,
      url,
      techText,
      choice,
      icon,
      lastModified,
      block
    })
  }

  projects.sort(function (a, b) {
    const keyA = new Date(a.lastModified)
    const keyB = new Date(b.lastModified)
    if (keyA < keyB) return 1
    if (keyA > keyB) return -1
    return 0
  })

  return projects
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

    posts.push(getPostProperties(post?.value))
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
      const vi = get(post, 'properties.vi.rich_text[0].plain_text') || ''

      // en
      const en = get(post, 'properties.en.rich_text[0].plain_text') || ''

      // fr
      const fr = get(post, 'properties.fr.rich_text[0].plain_text') || ''

      // notionUrl
      const notionUrl = get(post, 'properties.notionURL.formula.string') || ''

      return {
        id,
        title,
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
