import { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'
import { StaticImageData } from 'next/image'
import { Block } from 'notion-types'

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
