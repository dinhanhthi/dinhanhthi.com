import { exPost, ImgurUrlType } from '@/src/interface'
import { Post, PostHeaderType, Tag } from '@notion-x/src/interface'
import { mapTag } from '@notion-x/src/lib/helpers'
import { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints'
import { Metadata } from 'next'
import { Block, ExtendedRecordMap } from 'notion-types'

import * as fs from 'fs'
import * as path from 'path'

import me from '../../data/me'

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

export async function saveObjectToFile(obj: any, filename: string): Promise<void> {
  const downloadsPath = path.join(process.env.HOME!, 'Downloads', filename)
  fs.writeFileSync(downloadsPath, JSON.stringify(obj, null, 2))
}

export async function loadObjectFromFile(filename: string): Promise<any> {
  const downloadsPath = path.join(process.env.HOME!, 'Downloads', filename)
  return JSON.parse(fs.readFileSync(downloadsPath, 'utf8'))
}
