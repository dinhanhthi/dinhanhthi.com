import { exPost, ImgurUrlType } from '@/src/interface'
import { Post, PostHeaderType, Tag, AnnotationIgnoreField } from '@/src/lib/notion/interface'
import {
  QueryDatabaseParameters,
  RichTextItemResponse,
  TextRichTextItemResponse
} from '@notionhq/client/build/src/api-endpoints'
import { Metadata } from 'next'
import { Block, ExtendedRecordMap } from 'notion-types'
import cn from 'classnames'
import * as types from 'notion-types'
import slugify from 'slugify'

import * as fs from 'fs'
import * as path from 'path'

import me from '@/src/data/me'

// ============================================================================
// Text and Slug Utilities
// ============================================================================

export function generateAnchor(blockId: string, text: string) {
  return `${makeSlugText(text)}-${blockId.slice(-5)}`
}

export function makeSlugText(text?: string | null): string | undefined {
  if (!text) return undefined
  return slugify(text, {
    lower: true,
    locale: 'vi',
    remove: /[:?&".,/\\]/g
  })
}

export function cleanText(text?: string) {
  if (!text) return undefined
  return text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
}

// ============================================================================
// Color Utilities
// ============================================================================

export const waveColors = [
  '0, 0, 255',
  '255, 0, 166',
  '0, 0, 0',
  '166, 82, 0',
  '0, 120, 0',
  '166, 0, 82',
  '166, 0, 255',
  '0, 139, 139',
  '0, 200, 255',
  '0, 200, 166',
  '180, 200, 0'
]

export const getColorIndex = (index?: number) => {
  return (index || 0) % waveColors.length
}

export function mapColorClass(color?: string, defaultWhite?: boolean): string | null {
  switch (color) {
    case 'gray':
      return 'text-gray-500'
    case 'brown':
      return 'text-brown-500'
    case 'orange':
      return 'text-orange-500'
    case 'yellow':
      return 'text-yellow-500'
    case 'green':
      return 'text-emerald-600'
    case 'blue':
      return 'text-blue-500'
    case 'purple':
      return 'text-purple-500'
    case 'pink':
      return 'text-pink-500'
    case 'red':
      return 'text-red-500'
    // Highlight
    case 'gray_background':
      return 'bg-gray-100'
    case 'brown_background':
      return 'bg-[#f4eeee]'
    case 'orange_background':
      return 'bg-orange-100'
    case 'yellow_background':
      return 'bg-amber-100'
    case 'green_background':
      return 'bg-[#deffdb]'
    case 'blue_background':
      return 'bg-sky-100'
    case 'purple_background':
      return 'bg-purple-100'
    case 'pink_background':
      return 'bg-pink-100'
    case 'red_background':
      return 'bg-red-100'
    case 'teal_background':
      return 'notion-teal_background'
    default:
      return defaultWhite ? 'bg-white' : null
  }
}

// ============================================================================
// Image Utilities
// ============================================================================

export const defaultBlurData = {
  url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAC2AUoDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAECBv/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A74ABFQAAAABAAAAABFAAAAAAABUAURQAABAAAAAAAEAAAAABpQAQAAAAQAAAEBRAAAAAFEAUQBRFAAAAAAAAAAAQAAAAAAAaAAAABAAAAQAAAEBRAFEAUQBRAFEUAAAAFEAVAAAAAAAAAAABoAAEBUAAEAAAQAAABAFEAUQBRAFEUAABUAUQBRAFEUAAAAAAAAGgAEVAAAEABFQAEAAABAUQBRAFEAURQAAFQBRFAAAAAAAAAAAABsQAAABAAAQABAABAAAAAAQFAAAAVFAAAABUFABAUAAAAAAAGgAAAEAARUAABAAEUBAAAAAAQFAAAAVFAAAABQAQUAEBRAFEAbBAVFQAABFQAAEFQAAEFAQUBBQEUAAAAABUAUARQARQBFQAAAAAAG0UBAAAAEUBAAAAQVAAAAAAABQEUAAAAAAAAARQARUAAAAAABoVAAAAAAAQAAAAAAAAAAAAAAAAFBBQEAAAAAAQAAAAAAAbQAAAAAAAQAAAAAAAAAAAAABQAAAAAQAAAAAEAAAAAAAH/2Q==',
  width: 475,
  height: 263
}

/**
 * Imgur has an api for resizing images based on the url of the image.
 *
 * @see {@link https://api.imgur.com/models/image#thumbs Image thumbnails - Imgur API}
 *
 * @param url
 * @param type t (160x160), m (320x320), l (640x640), h (1024x1024) all the image proportions are maintained
 * @param ignoreImgType in case we don't want to add "type" to the url of certain images
 */
export const parseImgurUrl = (opts: {
  url: string
  type?: ImgurUrlType
  ignoreImgType?: string
}) => {
  if (!opts.url || !opts.type || !opts.url.includes('imgur')) return opts.url
  // If url is a gif or png, return the original url
  if (opts.url.includes('.gif') || (opts.ignoreImgType && opts.url.includes(opts.ignoreImgType))) {
    return opts.url
  }
  // return url + type
  return opts.url.replace(/(\.\w+$)/, `${opts.type}$1`)
}

// ============================================================================
// Taxonomy and Tag Utilities
// ============================================================================

export function mapTag(tagName: string, tagPrefix: string, topics: Tag[] = []): Tag {
  if (!tagName) throw new Error('tagName is required')
  return {
    id: makeSlugText(tagName),
    name: tagName,
    description: topics.find(topic => topic.name === tagName)?.description,
    longName: topics.find(topic => topic.name === tagName)?.longName,
    slug: makeSlugText(tagName),
    uri: `/${tagPrefix}/${makeSlugText(tagName)}/`
  }
}

// Used for both tags and categories
export type Taxonomy = {
  id: string
  name: string
  slug: string
  uri: string
}
export function mapTaxonomy(taxName: string, taxPrefix: string): Taxonomy {
  if (!taxName) throw new Error('taxName is required')
  return {
    id: makeSlugText(taxName)!,
    name: taxName,
    slug: makeSlugText(taxName)!,
    uri: `/${taxPrefix}/${makeSlugText(taxName)}/`
  }
}

// ============================================================================
// URI and URL Utilities
// ============================================================================

export function getUri(type: 'tag' | 'note', slug?: string): string | undefined {
  if (!slug) return undefined
  switch (type) {
    case 'tag':
      return `/tag/${slug}/`

    case 'note':
      return `/note/${slug}/`

    default:
      return `/note/${slug}/`
  }
}

export function mapNoteUri(postSlug: string, noteLabel?: string): string {
  return `/${noteLabel ?? 'note'}/${postSlug}/`
}

export function removeBaseUrl(url: string) {
  const baseUrlRegex = /^(https?:\/\/[^/]+)/
  const matches = url.match(baseUrlRegex)
  if (matches && matches.length > 1) {
    const baseUrl = matches[1]
    return url.replace(baseUrl, '')
  }
  return url
}

// ============================================================================
// Notion ID and UUID Utilities
// ============================================================================

/**
 * Convert "7c2e54318e52416ca5769831454bf08d" or "7c2e5431-8e52-416c-a576-9831454bf08d"
 * to "7c2e5431-8e52-416c-a576-9831454bf08d"
 */
export function idToUuid(id: string): string | null {
  if (!id) {
    return null
  }

  id = id.split('?')[0]
  const match = id.match(/\b([a-f0-9]{32})\b/)

  if (match) {
    return `${id.slice(0, 8)}-${id.slice(8, 4 + 8)}-${id.slice(12, 4 + 12)}-${id.slice(
      16,
      4 + 16
    )}-${id.slice(20)}`
  }

  const match2 = id.match(/\b([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\b/)
  if (match2) {
    return match2[1]
  }

  return null
}

// ============================================================================
// Notion Rich Text and Annotation Utilities
// ============================================================================

export function generateTextAnnotationClasses(
  annotations: TextRichTextItemResponse['annotations'],
  ignore?: AnnotationIgnoreField[]
): string {
  return cn({
    'font-semibold': annotations.bold && !ignore?.includes('bold'),
    italic: annotations.italic && !ignore?.includes('italic'),
    'underline underline-offset-4': annotations.underline && !ignore?.includes('underline'),
    'line-through': annotations.strikethrough && !ignore?.includes('strikethrough'),
    'font-mono text-[85%] bg-[#ececec] text-[#067b26] p-[1px_4px_2px_4px] rounded break-words border-[1px_solid_#ddd]':
      annotations.code && !ignore?.includes('code'),
    [mapColorClass(annotations.color) as any]: true && !ignore?.includes('color')
  })
}

export function getJoinedRichText(richTextArr?: RichTextItemResponse[]): string {
  if (!richTextArr || !richTextArr.length) return ''
  const textArr = richTextArr.map((richText: RichTextItemResponse) => richText.plain_text)
  return textArr.join('')
}

// ============================================================================
// Date Utilities
// ============================================================================

export function isDateAfter(date1?: string, date2?: string): boolean {
  if (!date1 || !date2) return false
  const dateOne = new Date(date1).setHours(0, 0, 0, 0)
  const dateTwo = new Date(date2).setHours(0, 0, 0, 0)
  return dateOne > dateTwo
}

export function getCreatedDate(block: types.Block, createdId: string) {
  const _cDf = block.properties?.[`${createdId}`]?.[0]?.[1]?.[0]?.[1]?.['start_date']
  const createdDateField = _cDf ? new Date(_cDf).toISOString() : null
  const created_time = new Date(block.created_time).toISOString()
  return createdDateField || created_time
}

export function getModifedDate(block: types.Block, modifiedId: string) {
  const _mDf = block.properties?.[`${modifiedId}`]?.[0]?.[1]?.[0]?.[1]?.['start_date']
  const modifiedDateField = _mDf ? new Date(_mDf).toISOString() : null
  const last_edited_time = new Date(block.last_edited_time).toISOString()
  return modifiedDateField || last_edited_time
}

// ============================================================================
// Pagination Utilities
// ============================================================================

/**
 * Get a right start_cursor for pagination based on current page and posts
 * @param posts
 * @param postsPerPage
 * @param currentPage
 * @returns next_cursor or `undefined` (it has to be `undefined`, not `null` because
 * Notion API doesn't accept `null` value for `start_cursor`)
 */
export function getStartCursorForCurrentPage(
  currentPage: number,
  posts: any,
  postsPerPage: number
): string | undefined {
  if (posts?.length === 0) return undefined
  if (currentPage === 1) return undefined
  const numPages = Math.ceil(posts.length / postsPerPage)
  if (currentPage > numPages) return undefined
  return posts[(currentPage - 1) * postsPerPage]?.id
}

// ============================================================================
// Notion Query Filters
// ============================================================================

export function getFilterOf(type: 'tag' | 'blog', data?: Tag): any {
  switch (type) {
    case 'tag':
      return {
        property: 'tags',
        multi_select: {
          contains: data?.name
        }
      }
    case 'blog':
      return {
        property: 'blog',
        checkbox: {
          equals: false
        }
      }
    default:
      return null
  }
}

/**
 * Filter to be used in getPosts(). Remark, we ignore single page (where isPage = true on Notion)
 */
export function getFilter(filter?: any): QueryDatabaseParameters['filter'] {
  const defaultFilter = [] as any[]

  // Ignore single page
  defaultFilter.push({
    property: 'isPage',
    checkbox: {
      equals: false
    }
  })
  // Ignore "hide" pages
  defaultFilter.push({
    property: 'hide',
    checkbox: {
      equals: false
    }
  })
  // Ignore sandbox posts in production
  if (process.env.ENV_MODE === 'prod') {
    defaultFilter.push({
      property: 'published',
      checkbox: {
        equals: true
      }
    })
  }
  if (!filter) return { and: defaultFilter }
  if (!filter?.and)
    return {
      and: [...defaultFilter, filter]
    }
  if (filter?.and)
    return {
      and: [...defaultFilter, ...(filter?.and ?? [])]
    }
}

// ============================================================================
// Metadata and SEO Utilities
// ============================================================================

export function generateMetaTitle(title: string) {
  return `${title} | Site of Thi`
}

export function getMetadata(opts: {
  title: string
  description?: string
  images?: any[]
}): Metadata {
  return {
    title: generateMetaTitle(opts.title),
    description: opts.description || me.quote,
    openGraph: {
      title: opts.title || "Hi! I'm Thi",
      description: opts.description || me.quote,
      type: 'website',
      images: opts.images || [
        {
          url: 'https://i.imgur.com/PyXUtfTh.png',
          width: 1024,
          height: 581
        }
      ]
    }
  }
}

// ============================================================================
// Post Transformation Utilities
// ============================================================================

export function transformUnofficialPostProps(
  post: Block,
  topics: Tag[] = [],
  recordMap?: ExtendedRecordMap
): exPost {
  const id = post.id
  const properties = post?.properties
  const slug = properties?.[`${process.env.NEXT_PUBLIC_ID_SLUG}`]?.[0]?.[0] ?? ''
  const title = properties?.title?.[1]?.[0] || properties?.title?.[0]?.[0]
  const description = properties?.[`${process.env.NEXT_PUBLIC_ID_DESC}`]?.[0]?.[0]
  const rawTitle = properties?.title
  const date =
    properties?.[`${process.env.NEXT_PUBLIC_ID_LAST_MODIFIED}`]?.[0]?.[1]?.[0]?.[1]?.start_date ??
    new Date(post?.last_edited_time).toISOString()
  const createdDate =
    properties?.[`${process.env.NEXT_PUBLIC_ID_CREATED_DATE}`]?.[0]?.[1]?.[0]?.[1]?.start_date ??
    new Date(post?.created_time).toISOString()
  const tags = properties?.[`${process.env.NEXT_PUBLIC_ID_TAGS}`]?.[0]?.[0]
    .split(',')
    ?.filter((tagName: string) => topics.map(topic => topic.name).includes(tagName))
    ?.map((tagName: string) => mapTag(tagName, 'tag', topics))
  const isPublished = properties?.[`${process.env.NEXT_PUBLIC_ID_PUBLISHED}`]?.[0]?.[0] === 'Yes'
  const isPage = properties?.[`${process.env.NEXT_PUBLIC_ID_IS_PAGE}`]?.[0]?.[0] === 'Yes'
  const isDraft = properties?.[`${process.env.NEXT_PUBLIC_ID_DRAFT}`]?.[0]?.[0] === 'Yes'
  const icon = post.format?.page_icon
  const pageCover = post.format?.page_cover
  const coverPosition = (1 - (post?.format?.page_cover_position || 0.5)) * 100
  const wellWritten = properties?.[`${process.env.NEXT_PUBLIC_ID_WELL_WRITTEN}`]?.[0]?.[0] === 'Yes'
  const pinned = properties?.[`${process.env.NEXT_PUBLIC_ID_PINNED}`]?.[0]?.[0] === 'Yes'
  const discrete = properties?.[`${process.env.NEXT_PUBLIC_ID_DISCRETE}`]?.[0]?.[0] === 'Yes'
  const blog = properties?.[`${process.env.NEXT_PUBLIC_ID_BLOG}`]?.[0]?.[0] === 'Yes'
  const hide = properties?.[`${process.env.NEXT_PUBLIC_ID_HIDE}`]?.[0]?.[0] === 'Yes'
  const language = properties?.[
    `${process.env.NEXT_PUBLIC_ID_LANGUAGE}`
  ]?.[0]?.[0] as PostHeaderType['language']
  // From the current post -> get the id of the corresponding language post -> get its slug
  const vi_id = properties?.[`${process.env.NEXT_PUBLIC_ID_VI}`]?.[0]?.[1]?.[0]?.[1]
  const vi =
    recordMap && vi_id
      ? recordMap.block[vi_id]?.value?.properties?.[`${process.env.NEXT_PUBLIC_ID_SLUG}`]?.[0]?.[0]
      : undefined
  const en_id = properties?.[`${process.env.NEXT_PUBLIC_ID_EN}`]?.[0]?.[1]?.[0]?.[1]
  const en =
    recordMap && en_id
      ? recordMap.block[en_id]?.value?.properties?.[`${process.env.NEXT_PUBLIC_ID_SLUG}`]?.[0]?.[0]
      : undefined
  const fr_id = properties?.[`${process.env.NEXT_PUBLIC_ID_FR}`]?.[0]?.[1]?.[0]?.[1]
  const fr =
    recordMap && fr_id
      ? recordMap.block[fr_id]?.value?.properties?.[`${process.env.NEXT_PUBLIC_ID_SLUG}`]?.[0]?.[0]
      : undefined
  const notionUrl = properties?.[`${process.env.NEXT_PUBLIC_NOTION_PUBLISHED_URL}`]?.[0]?.[0]

  return {
    id,
    slug,
    uri: `/note/${slug}/`,
    title,
    description,
    rawTitle,
    date,
    createdDate,
    tags,
    isPublished,
    isPage,
    isDraft,
    icon,
    pageCover,
    coverPosition,
    wellWritten,
    pinned,
    discrete,
    blog,
    hide,
    language,
    vi,
    en,
    fr,
    notionUrl
  }
}

/**
 * We don't want to show duplicated posts in different languages.
 * The order of priority is: en > vi > fr
 */
export function filterDupLangPosts(posts: Post[]): Post[] {
  return posts.filter(post => {
    const lang = post.language
    if (lang === 'en' || !lang) return true
    if (lang === 'vi' && !post.en) return true
    if (lang === 'fr' && !post.en && !post.vi) return true
    return false
  })
}

// ============================================================================
// File I/O Utilities
// ============================================================================

export async function saveObjectToFile(obj: any, filename: string): Promise<void> {
  const downloadsPath = path.join(process.env.HOME!, 'Downloads', filename)
  fs.writeFileSync(downloadsPath, JSON.stringify(obj, null, 2))
}

export async function loadObjectFromFile(filename: string): Promise<any> {
  const downloadsPath = path.join(process.env.HOME!, 'Downloads', filename)
  return JSON.parse(fs.readFileSync(downloadsPath, 'utf8'))
}
