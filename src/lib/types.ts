import { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'
import { StaticImageData } from 'next/image'
import { Block } from 'notion-types'
import * as types from 'notion-types'
import * as React from 'react'

export type OptionalCatchAllProps = { params: OptionalCatchAllParams }
export type OptionalCatchAllParams = { slug: string[] }
export type DynamicSegmentParamsProps = { params: DynamicSegmentParams }
export type DynamicSegmentParams = { slug: string }

export type ImageType = {
  sourceUrl?: string | null
  sizes?: string
  altText?: string
  blurDataURL?: string
  width?: number
  height?: number
  staticImageData?: StaticImageData // for default featured images
  imgur?: string // image uploaded to imgur
} | null

export type PostHeaderType = {
  id?: string
  title: string
  description?: string
  rawTitle?: any
  featuredImage?: ImageType
  date?: string // the same as last modified date (or finalModified)
  createdDate?: string // used to display "updated" badge
  categories?: Category[]
  tags?: Tag[]
  authors?: Author[]
  selected?: boolean
  isPublished?: boolean
  bookCover?: ImageType
  isDraft?: boolean // is this post a draft?
  isPage?: boolean // is this post a page?
  // icon?: {
  //   emoji?: string
  //   img?: ImageType
  // }
  icon?: string
  pageCover?: string
  coverPosition?: number
  wellWritten?: boolean
  pinned?: boolean
  discrete?: boolean
  blog?: boolean
  hide?: boolean
  language?: Language // which language of the current post, default is 'en'
  vi?: string // slug of the Vietnamese version of the current post
  en?: string // slug of the English version of the current post
  fr?: string // slug of the French version of the current post
  notionUrl?: string // published url of the Notion page (if any)
}

export type Language = 'vi' | 'en' | 'fr'

export interface Post extends PostHeaderType {
  slug: string
  uri: string
  id?: string
  excerpt?: RichTextItemResponse[]
  block?: Block
  customEmojiUrl?: string // Added from exPost
}

export type Page = {
  id?: string
  title: string
  uri: string
  slug?: string
}

export type Category = {
  name: string
  uri: string
  // "slug" is obligatory but we set it "optional" here because the categories taken
  // from Notion don't have slug
  slug?: string | null
  id?: string
  description?: string
  style?: {
    bgColor: string
    textColor: string
    bdColor?: string
    titleColor?: string // Used in header of category page
  }
  featuredImage?: ImageType
  fontello?: string
  backgroundClassName?: string // used for index page
}

export type Tag = {
  name: string
  longName?: string
  id?: string
  slug?: string
  uri?: string
  icon?: ImageType
  className?: string
  description?: string
  pinned?: boolean
  color?: string
  iconUrl?: string // Extended from interface.d.ts
  hide?: boolean // Extended from interface.d.ts
}

export type Author = {
  slug?: string | null
  id: string
  name?: string | null
  uri: string
  description?: string | null
  avatarUrl?: string | null
  icon?: string | null
  role?: string | null
  email?: string | null
  website?: string | null
  posts?: Post[] | null
}

export type NotionSorts = {
  property: string
  direction: 'ascending' | 'descending'
}

export type AnnotationIgnoreField =
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'underline'
  | 'code'
  | 'color'

export type TextIgnoreField = 'hyperlink' | AnnotationIgnoreField

export type SearchResult = {
  id: string
  title: string
  slug: string
  titleHighlighted: string
  textHighlighted: string
  isPublished: boolean
  isBookPost?: boolean
  isFake?: boolean // used to not perform the request
}

export type BookmarkPreview = {
  url: string
  title?: string
  description: string | null
  favicon?: string
  imageSrc: string | null
}

export type SearchParams = {
  query: string
  limit?: number
  filters?: any
}

// Types from types.ts
export type MapPageUrlFn = (
  pageId: string,
  recordMap?: types.ExtendedRecordMap | undefined
) => string
export type MapImageUrlFn = (url: string, block: types.Block) => string
export type SearchNotionFn = (params: types.SearchParams) => Promise<types.SearchResults>

export type ComponentOverrideFn = (props: any, defaultValueFn: () => React.ReactNode) => any

export interface NotionComponents {
  // TODO: better typing for arbitrary react components
  Image: any
  Link: any
  PageLink: any
  // Checkbox: React.FC<{ isChecked: boolean; blockId: string }>

  // blocks
  Code: any
  Equation: any
  Callout?: any

  // collection
  // Collection: any
  Property?: any

  propertyTextValue: ComponentOverrideFn
  propertySelectValue: ComponentOverrideFn
  propertyRelationValue: ComponentOverrideFn
  propertyFormulaValue: ComponentOverrideFn
  propertyTitleValue: ComponentOverrideFn
  propertyPersonValue: ComponentOverrideFn
  propertyFileValue: ComponentOverrideFn
  propertyCheckboxValue: ComponentOverrideFn
  propertyUrlValue: ComponentOverrideFn
  propertyEmailValue: ComponentOverrideFn
  propertyPhoneNumberValue: ComponentOverrideFn
  propertyNumberValue: ComponentOverrideFn
  propertyLastEditedTimeValue: ComponentOverrideFn
  propertyCreatedTimeValue: ComponentOverrideFn
  propertyDateValue: ComponentOverrideFn

  // assets
  Pdf: any
  Tweet: any
  Modal: any
  Embed: any

  // page navigation
  Header: any

  // optional next.js-specific overrides
  nextImage?: any
  nextLink?: any
}

export interface CollectionViewProps {
  collection: types.Collection
  collectionView: types.CollectionView
  collectionData: types.CollectionQueryResult
  padding?: number
  width?: number
}

export interface CollectionCardProps {
  collection: types.Collection
  block: types.PageBlock
  cover: types.CollectionCardCover
  coverSize: types.CollectionCardCoverSize
  coverAspect: types.CollectionCardCoverAspect
  properties?: Array<{
    property: types.PropertyID
    visible: boolean
  }>
  className?: string
}
export interface CollectionGroupProps {
  collection: types.Collection
  collectionViewComponent: React.ElementType
  collectionGroup: any
  hidden: boolean
  schema: any
  value: any
  summaryProps: any
  detailsProps: any
}

// Additional types from interface.d.ts
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
  tags?: string[]
  favorite?: boolean
  pinned?: boolean
  keySearch?: string
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
  color: string // Fixed typo: was "sting"
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

export interface ToolCommon {
  id: string
  name: string
  description?: string
  shortDescription?: string // max 6 words
  iconUrl: string
  tags: string[]
  category?: string
  url: string
  date: string
  block: Block // used to fetch icons
  keySearch?: string
  favorite?: boolean
  hide?: boolean
}

export interface Tool extends ToolCommon {
  isFree: boolean
}

export interface Book extends ToolCommon {
  star: number
  author: string
  isReading?: boolean
  isOthers?: boolean
}

export interface Game extends ToolCommon {
  isFree: boolean
}