'use client'

import cn from 'classnames'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { Block, ExtendedRecordMap, PreviewImage } from 'notion-types'
import * as React from 'react'

import { CodeIcon } from '@/src/app/icons/CodeIcon'
import SigmaIcon from '@/src/app/icons/SigmaIcon'
import { ToggleOffIcon } from '@/src/app/icons/ToggleOffIcon'
import { ToggleOnIcon } from '@/src/app/icons/ToggleOnIcon'
import { usePostDateStatus } from '@/src/hooks/usePostDateStatus'
import { BlockOptionsContextType } from '@/src/lib/notion/context'
import { NotionRenderer } from '@/src/lib/notion/renderer'
import ScrollToTop from './ScrollToTop'
import { SimpleImageProps } from './SimpleImage'
import TooltipX from './tooltip-x'

type PostBodyProps = {
  recordMap: ExtendedRecordMap
  className?: string
  blockOptions?: BlockOptionsContextType
  customPreviewImage?: PreviewImage
  useSimpleImage?: boolean
  fontClass?: string // used for a custom font in the post, it's a class name
  simpleImageProps?: SimpleImageProps
  showUpdatedIndicator?: boolean
  lastModifiedIdKey?: string // used as NEXT_PUBLIC_ID_LAST_MODIFIED
  createdIdKey?: string // used as NEXT_PUBLIC_ID_CREATED_DATE
  showUpdateButtonClassName?: string
  showUpdateButtonPositionClass?: string
  showBackToTopButton?: boolean
  postCreatedDate?: string // used to show correctly the update blocks
  postLastModifiedDate?: string // used to show correctly the update blocks
}

const Equation = dynamic(() => import('./BlockEquation'), {
  loading: () => (
    <div className="mx-auto my-4 flex h-14 w-1/2 animate-pulse items-center justify-center rounded-md bg-slate-200">
      <SigmaIcon className="h-7 w-7 text-slate-500" />
    </div>
  )
})
const Code = dynamic(() => import('./BlockCode'), {
  loading: () => (
    <div className="my-4 flex h-14 w-full animate-pulse items-center justify-center rounded-md bg-slate-200">
      <CodeIcon className="h-7 w-7 text-slate-500" />
    </div>
  )
})

// In case we need more suppored components, check this out:
// https://github.com/transitive-bullshit/nextjs-notion-starter-kit/blob/main/components/NotionPage.tsx
export default function PostBody(props: PostBodyProps) {
  const components = React.useMemo(
    () => ({
      nextImage: Image,
      nextLink: Link,
      Code,
      Equation
    }),
    []
  )

  let showUpdatedIndicator = props.showUpdatedIndicator

  const id = Object.keys(props.recordMap.block)[0]
  const block = props.recordMap.block[id]?.value
  const { createdDate, modifiedDate } = getPostProperties(
    block,
    props.lastModifiedIdKey,
    props.createdIdKey
  )
  if (!createdDate || !modifiedDate) {
    showUpdatedIndicator = false
  }

  const status = usePostDateStatus(
    createdDate!,
    modifiedDate!,
    props.blockOptions?.maxDaysWinthin ?? 7
  )

  showUpdatedIndicator = showUpdatedIndicator && status !== 'new'
  const [showOnlyUpdatedBlocks, setShowOnlyUpdatedBlocks] = React.useState(false)

  return (
    <>
      <div className={props.className}>
        <NotionRenderer
          recordMap={props.recordMap}
          fullPage={true}
          darkMode={false}
          components={components}
          showTableOfContents={false}
          minTableOfContentsItems={3}
          disableHeader={true}
          previewImages={true}
          blockOptions={props.blockOptions}
          customPreviewImage={props.customPreviewImage}
          useSimpleImage={props.useSimpleImage}
          postCreatedDate={props.postCreatedDate}
          postLastModifiedDate={props.postLastModifiedDate}
          fontClass={props.fontClass}
          showUpdatedIndicator={showUpdatedIndicator}
          simpleImageProps={props.simpleImageProps}
          showOnlyUpdatedBlocks={showOnlyUpdatedBlocks}
          setShowOnlyUpdatedBlocks={setShowOnlyUpdatedBlocks}
        />
      </div>
      {showUpdatedIndicator && status === 'updatedWithin' && (
        <button
          onClick={() => setShowOnlyUpdatedBlocks(!showOnlyUpdatedBlocks)}
          className={cn(
            'fixed z-50 hidden h-12 w-12 rounded-full bg-slate-200 hover:cursor-pointer hover:bg-slate-300 md:block',
            props.showUpdateButtonPositionClass
              ? props.showUpdateButtonPositionClass
              : 'right-10 bottom-24'
          )}
        >
          <div
            id="updated-blocks-toggle"
            className={cn(
              'flex h-full w-full items-center justify-center',
              props.showUpdateButtonClassName
                ? props.showUpdateButtonClassName
                : 'before:!top-[15px] before:!right-[55px] before:!left-auto'
            )}
          >
            {!showOnlyUpdatedBlocks && <ToggleOffIcon className="h-7 w-7 text-green-700" />}
            {showOnlyUpdatedBlocks && <ToggleOnIcon className="h-7 w-7 text-green-700" />}
          </div>
          <TooltipX id={'#updated-blocks-toggle'}>
            {!showOnlyUpdatedBlocks ? 'Highlight only updated blocks' : 'Back to default display'}
          </TooltipX>
        </button>
      )}
      {props.showBackToTopButton && (
        <ScrollToTop
          positionClassName={
            showUpdatedIndicator && status === 'updatedWithin'
              ? 'right-10 md:bottom-24 bottom-8'
              : 'right-10 bottom-8'
          }
        />
      )}
    </>
  )
}

function getPostProperties(
  post: Block,
  lastModifiedIdKey?: string,
  createdIdKey?: string
): { createdDate?: string; modifiedDate?: string } {
  if (!lastModifiedIdKey || !createdIdKey) {
    return {
      createdDate: undefined,
      modifiedDate: undefined
    }
  }
  const properties = post?.properties
  const modifiedDate =
    properties?.[`${lastModifiedIdKey}`]?.[0]?.[1]?.[0]?.[1]?.start_date ??
    new Date(post?.last_edited_time).toISOString()
  const createdDate =
    properties?.[`${createdIdKey}`]?.[0]?.[1]?.[0]?.[1]?.start_date ??
    new Date(post?.created_time).toISOString()

  return { createdDate, modifiedDate }
}
