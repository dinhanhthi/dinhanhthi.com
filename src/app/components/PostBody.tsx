'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { Block, ExtendedRecordMap, PreviewImage } from 'notion-types'
import * as React from 'react'

import { CodeIcon } from '@/src/app/icons/CodeIcon'
import SigmaIcon from '@/src/app/icons/SigmaIcon'
import { usePostDateStatus } from '@/src/hooks/usePostDateStatus'
import { BlockOptionsContextType } from '@/src/lib/notion/context'
import { NotionRenderer } from '@/src/lib/notion/renderer'
import { SimpleImageProps } from './SimpleImage'

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
  postCreatedDate?: string // used to show correctly the update blocks
  postLastModifiedDate?: string // used to show correctly the update blocks
}

const Equation = dynamic(() => import('./BlockEquation'), {
  loading: () => (
    <div className="bg-skeleton-bg mx-auto my-4 flex h-14 w-1/2 animate-pulse items-center justify-center rounded-md">
      <SigmaIcon className="text-muted h-7 w-7" />
    </div>
  )
})
const Code = dynamic(() => import('./BlockCode'), {
  loading: () => (
    <div className="bg-skeleton-bg my-4 flex h-14 w-full animate-pulse items-center justify-center rounded-md">
      <CodeIcon className="text-muted h-7 w-7" />
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
