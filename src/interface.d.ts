import { Tag as TagNotionX } from '@notion-x/src/interface'
import { Block } from 'notion-types'

export type SiteTheme = 'dark' | 'light'

export type EnvMode = 'dev' | 'prod'

export type HeaderIcon = {
  url: string
  emoji: string
}

export type SlugTypeLabels = 'about' | 'blog'
export type GroupTypeReturn = { categories: Category[] } | { tags: Tag[] } | { authors: Author[] }

export type NotionPost = {
  id: string
  created_time: string
  last_edited_time?: string
  cover?: {
    external?: {
      url: string
    }
    file?: {
      url: string
    }
  }
  icon?: {
    emoji: string
    external?: {
      url: string
    }
    file?: {
      url: string
    }
  }
  properties?: {
    Name: {
      title: { plain_text: string }[]
    }
    url: string
    tags?: {
      multi_select: NotionTagData[]
    }
    author?: {
      select: { name: string }
    }
    excerpt?: {
      rich_text: { plain_text: string }[]
    }
  }
}

export interface BookmarkItem {
  id: string
  url: string
  createdTime: string
  title?: string
  description?: string
  coverUrl?: string
}

export type NotionBookmarkItem = {
  id: string
  created_time: string
  cover: {
    external: {
      url: string
    }
    file: {
      url: string
    }
  }
  properties: {
    title: {
      title: { plain_text: string }[]
    }
    url: {
      url: string
    }
    tag?: {
      multi_select: NotionTagData[]
    }
    icon?: {
      files?: {
        name?: string
        file?: { url?: string }
        external?: { url?: string }
      }[]
    }
    description?: {
      rich_text: { plain_text: string }[]
    }
    coverUrl?: {
      url: string
    }
  }
}

export type NotionTagData = {
  id: string
  name: string
  color: sting
}

export type NotionHeader = {
  cover?: { external: { url: string }; file: { url: string } }
  properties: {
    name: { title: { plain_text: string }[] }
    tags: { multi_select: { name: string }[] }
    slug: { rich_text: { plain_text: string }[] }
    draft: { checkbox: boolean }
    blog: { checkbox: boolean }
  }
}

export type ImgurUrlType = 't' | 'm' | 'l' | 'h'

export type Tag = TagNotionX & { iconUrl?: string; pinned?: boolean; hide?: boolean }

export type Tool = {
  id?: string
  name: string
  description: string
  iconUrl: string
  tag: string[]
  url: string
  isFree: boolean
  createdTime: string
  block: Block // used to fetch icons
}
