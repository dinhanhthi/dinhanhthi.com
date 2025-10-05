'use client'

/* eslint-disable jsx-a11y/anchor-has-content */
// import dynamic from 'next/dynamic'
import { ExtendedRecordMap, PreviewImage } from 'notion-types'
import * as React from 'react'

import { DiscreteColsType } from '@/src/components/notion/PostBody'
import { SimpleImageProps } from '@/src/components/notion/SimpleImage'
import { AssetWrapper } from '@/src/components/notion/asset-wrapper'
import { MapImageUrlFn, MapPageUrlFn, NotionComponents, SearchNotionFn } from '@/src/lib/notion/types'
import { wrapNextImage, wrapNextLink } from '@/src/lib/notion/next'
import { defaultMapImageUrl, defaultMapPageUrl } from '@/src/lib/notion/utils'

export type BlockOptionsContextType = {
  headingScrollMarginTopClass?: string // anchor scroll margin top class, depend on the height of nav
  blockCodeCopyText?: string // used in BlockCode to customize copy text
  blockCodeCopiedText?: string // used in BlockCode to customize copied text
  siteDomain?: string // used in hyperlinks
  labelTocTitle?: string // "In this page" or something like that
  postTocClassName?: string // class name for post TOC
  minNumHeadingsToShowToc?: number // minimum number of headings to show the TOC
  expandTocOnMobile?: boolean // show TOC on mobile
  notelabel?: string // /note/ or /blog/ or something like that
  maxDaysWinthin?: number // maximum number of days to show the "update" label
  slugKey?: string // used to get the slug of @tagged posts, the process.env.NEXT_PUBLIC_ID_SLUG isn't working
}

export interface NotionContext {
  recordMap: ExtendedRecordMap
  components: NotionComponents

  mapPageUrl: MapPageUrlFn
  mapImageUrl: MapImageUrlFn
  searchNotion?: SearchNotionFn
  isShowingSearch?: boolean
  onHideSearch?: () => void

  rootPageId?: string
  rootDomain?: string
  blockOptions?: BlockOptionsContextType
  customPreviewImage?: PreviewImage
  useSimpleImage?: boolean
  discreteStyle?: boolean
  postCreatedDate?: string
  postLastModifiedDate?: string
  fontClass?: string
  discreteColsType?: DiscreteColsType
  showUpdatedIndicator?: boolean
  simpleImageProps?: SimpleImageProps

  fullPage: boolean
  darkMode: boolean
  previewImages: boolean
  forceCustomImages: boolean
  showCollectionViewDropdown: boolean
  showTableOfContents: boolean
  minTableOfContentsItems: number
  linkTableTitleProperties: boolean
  isLinkCollectionToUrlProperty: boolean

  defaultPageIcon?: string
  defaultPageCover?: string
  defaultPageCoverPosition?: number

  zoom: any
}

export interface PartialNotionContext {
  recordMap?: ExtendedRecordMap
  components?: Partial<NotionComponents>

  mapPageUrl?: MapPageUrlFn
  mapImageUrl?: MapImageUrlFn
  searchNotion?: SearchNotionFn
  isShowingSearch?: boolean
  onHideSearch?: () => void

  rootPageId?: string
  rootDomain?: string

  fullPage?: boolean
  darkMode?: boolean
  previewImages?: boolean
  forceCustomImages?: boolean
  showCollectionViewDropdown?: boolean
  linkTableTitleProperties?: boolean
  isLinkCollectionToUrlProperty?: boolean

  showTableOfContents?: boolean
  minTableOfContentsItems?: number

  defaultPageIcon?: string
  defaultPageCover?: string
  defaultPageCoverPosition?: number

  zoom?: any
}

const DefaultLink: React.FC = props => <a target="_blank" rel="noopener noreferrer" {...props} />
const DefaultLinkMemo = React.memo(DefaultLink)
const DefaultPageLink: React.FC = props => <a {...props} />
const DefaultPageLinkMemo = React.memo(DefaultPageLink)

const DefaultEmbed = (props: any) => <AssetWrapper {...props} />

export const dummyLink = ({ href, rel, target, title, ...rest }: any) => <span {...rest} />

const dummyComponent = (name: string) => () => {
  console.warn(
    `Warning: using empty component "${name}" (you should override this in NotionRenderer.components)`
  )

  return null
}

// TODO: should we use React.memo here?
// https://reactjs.org/docs/react-api.html#reactmemo
const dummyOverrideFn = (_: any, defaultValueFn: () => React.ReactNode) => defaultValueFn()

const defaultComponents: NotionComponents = {
  Image: null, // disable custom images by default
  Link: DefaultLinkMemo,
  PageLink: DefaultPageLinkMemo,
  Callout: undefined, // use the built-in callout rendering by default

  Code: dummyComponent('Code'),
  Equation: dummyComponent('Equation'),

  // Collection: dummyComponent('Collection'),
  Property: undefined, // use the built-in property rendering by default

  propertyTextValue: dummyOverrideFn,
  propertySelectValue: dummyOverrideFn,
  propertyRelationValue: dummyOverrideFn,
  propertyFormulaValue: dummyOverrideFn,
  propertyTitleValue: dummyOverrideFn,
  propertyPersonValue: dummyOverrideFn,
  propertyFileValue: dummyOverrideFn,
  propertyCheckboxValue: dummyOverrideFn,
  propertyUrlValue: dummyOverrideFn,
  propertyEmailValue: dummyOverrideFn,
  propertyPhoneNumberValue: dummyOverrideFn,
  propertyNumberValue: dummyOverrideFn,
  propertyLastEditedTimeValue: dummyOverrideFn,
  propertyCreatedTimeValue: dummyOverrideFn,
  propertyDateValue: dummyOverrideFn,

  Pdf: dummyComponent('Pdf'),
  Tweet: dummyComponent('Tweet'),
  Modal: dummyComponent('Modal'),

  Header: <></>,
  Embed: DefaultEmbed
}

const defaultNotionContext: NotionContext = {
  recordMap: {
    block: {},
    collection: {},
    collection_view: {},
    collection_query: {},
    notion_user: {},
    signed_urls: {}
  },

  components: defaultComponents,

  mapPageUrl: defaultMapPageUrl(),
  mapImageUrl: defaultMapImageUrl as any,
  searchNotion: null as any,
  isShowingSearch: false,
  onHideSearch: null as any,

  fullPage: false,
  darkMode: false,
  previewImages: false,
  forceCustomImages: false,
  showCollectionViewDropdown: true,
  linkTableTitleProperties: true,
  isLinkCollectionToUrlProperty: false,

  showTableOfContents: false,
  minTableOfContentsItems: 3,
  blockOptions: null as any,
  customPreviewImage: null as any,
  useSimpleImage: false as any,
  discreteStyle: false as any,
  postCreatedDate: null as any,
  postLastModifiedDate: null as any,
  fontClass: null as any,
  discreteColsType: 'single',
  showUpdatedIndicator: false as any,
  simpleImageProps: null as any,

  defaultPageIcon: null as any,
  defaultPageCover: null as any,
  defaultPageCoverPosition: 0.5,

  zoom: null
}

const ctx = React.createContext<NotionContext>(defaultNotionContext)

export const NotionContextProvider: React.FC<any> = ({
  components: themeComponents = {},
  children,
  mapPageUrl,
  mapImageUrl,
  rootPageId,
  ...rest
}) => {
  for (const key of Object.keys(rest)) {
    if (rest[key] === undefined) {
      delete rest[key]
    }
  }

  const wrappedThemeComponents = React.useMemo(
    () => ({
      ...themeComponents
    }),
    [themeComponents]
  )

  if (wrappedThemeComponents.nextImage) {
    wrappedThemeComponents.Image = wrapNextImage(themeComponents.nextImage)
  }

  if (wrappedThemeComponents.nextLink) {
    wrappedThemeComponents.nextLink = wrapNextLink(themeComponents.nextLink)
  }

  // ensure the user can't override default components with falsy values
  // since it would result in very difficult-to-debug react errors
  for (const key of Object.keys(wrappedThemeComponents)) {
    if (!wrappedThemeComponents[key]) {
      delete wrappedThemeComponents[key]
    }
  }

  const value = React.useMemo(
    () => ({
      ...defaultNotionContext,
      ...rest,
      rootPageId,
      mapPageUrl: mapPageUrl ?? defaultMapPageUrl(rootPageId),
      mapImageUrl: mapImageUrl ?? defaultMapImageUrl,
      components: { ...defaultComponents, ...wrappedThemeComponents }
    }),
    [mapImageUrl, mapPageUrl, wrappedThemeComponents, rootPageId, rest]
  )

  return <ctx.Provider value={value}>{children}</ctx.Provider>
}

export const NotionContextConsumer = ctx.Consumer

export const useNotionContext = (): NotionContext => {
  return React.useContext(ctx)
}
