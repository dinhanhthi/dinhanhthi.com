'use client'

import { PageIcon } from '@/src/app/components/page-icon'
import { Text } from '@/src/app/components/text'
import { usePostDateStatus } from '@/src/hooks/usePostDateStatus'
import cn from 'classnames'
import { get } from 'lodash'
import dynamic from 'next/dynamic'
import { ExtendedRecordMap } from 'notion-types'
import { Suspense } from 'react'

import TooltipX from '@/src/app/components/tooltip-x'
import { defaultPostTypeOpts } from '@/src/lib/config'
import { Post } from '@/src/lib/types'
import { Calendar, Languages, RefreshCcw, UserRound } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import me from '../../data/me'
import { getUri } from '../../lib/helpers'
import Header from './Header'
import ImageWithLoading from './ImageWithLoading'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

const DateComponent = dynamic(() => import('@/src/app/components/DateComponent'), {
  ssr: false,
  loading: () => <div className="h-4 w-36 animate-pulse rounded-md bg-slate-200" />
})

export const fullWidthPostCoverHeight = 'h-[25vh] max-h-[25vh] min-h-[25vh]'
export const gapHeaderItems = 'mb-3'

type HeaderPostProps = {
  recordMap: ExtendedRecordMap
  postProps: Post
  discreteStyle?: boolean
}

const pageCoverStyleCache: Record<string, object> = {}

export const containerHeaderClass = 'max-w-full bg-slate-50 drop-shadow-sm py-4'

export default function HeaderPost(props: HeaderPostProps) {
  const id = Object.keys(props.recordMap.block)[0]
  const block = props.recordMap.block[id]?.value

  const {
    rawTitle: title,
    createdDate,
    date: modifiedDate,
    tags,
    icon,
    customEmojiUrl,
    isDraft,
    coverPosition,
    vi,
    en,
    fr
  } = props.postProps

  const pageCoverObjectPosition = `center ${coverPosition}%`
  let pageCoverStyle = pageCoverStyleCache[pageCoverObjectPosition]
  if (!pageCoverStyle) {
    pageCoverStyle = pageCoverStyleCache[pageCoverObjectPosition] = {
      objectPosition: pageCoverObjectPosition
    }
  }

  const status = usePostDateStatus(
    createdDate!,
    modifiedDate!,
    get(defaultPostTypeOpts, 'maxDaysWinthin', 7)
  )

  return (
    <Header className="flex flex-col items-center gap-4 lg:flex-row">
      <div className="flex w-full shrink-0 flex-row items-center gap-4 lg:w-fit">
        {!icon && (
          <ImageWithLoading
            src="/logo_sketches/sketch_notes_nobg.png"
            alt="Notes"
            height={150}
            width={150}
            priority
          />
        )}
        {!!icon && (
          <div className="flex h-[75px] w-[75px] shrink-0 items-center justify-center rounded bg-gray-100 lg:h-[150px] lg:w-[150px]">
            <Suspense
              fallback={
                <div className={cn('h-[45px] w-[45px] animate-pulse rounded-full bg-slate-600')} />
              }
            >
              <PageIcon block={block} inline={false} inputIcon={customEmojiUrl} />
            </Suspense>
          </div>
        )}
        <h1 className="font-heading baseline -mb-2 gap-2 text-2xl text-slate-700 lg:hidden">
          <Text value={title} block={block} />
        </h1>
      </div>

      <div className="flex w-full flex-col gap-4">
        <h1 className="font-heading baseline -mb-2 hidden gap-2 text-3xl text-slate-700 lg:block">
          <Text value={title} block={block} />
        </h1>

        {/* Authors & Date & meta */}
        <div className="text-muted flex w-full flex-wrap items-center gap-3 text-sm sm:justify-start md:w-auto md:flex-nowrap">
          {/* draft */}
          {isDraft && <Badge variant="secondary">draft</Badge>}

          {/* Author */}
          <div className="flex flex-nowrap items-center gap-1 font-medium text-slate-700">
            <UserRound size={14} />
            {me.name}
          </div>

          {/* added */}
          <div className="flex flex-nowrap items-center gap-1">
            <Calendar size={14} />
            <DateComponent
              humanize={true}
              dateString={createdDate!}
              dateLabel="added"
              format="MMM DD, YYYY"
            />
          </div>

          {status !== 'normal' && (
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              {/* Updated */}
              {['updated', 'updatedWithin'].includes(status) && (
                <div
                  className={cn('flex flex-row flex-nowrap items-center gap-1', {
                    'text-green-700': status === 'updatedWithin'
                  })}
                >
                  <RefreshCcw size={14} />
                  <DateComponent
                    dateLabel="updated"
                    humanize={true}
                    dateString={modifiedDate!}
                    format="MMM DD, YYYY"
                  />
                </div>
              )}

              {/* New */}
              {status === 'new' && (
                <Badge variant="secondary" className="bg-amber-200 text-amber-900">
                  new
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        {tags && !!tags.length && (
          <div className="flex flex-wrap items-center gap-2">
            {tags.map(tag => (
              <React.Fragment key={tag.id}>
                <Link id={`tag-${tag.id}`} key={tag.uri} href={tag.uri || '/'}>
                  <Badge
                    className="font-normal hover:bg-sky-100 hover:text-sky-900"
                    variant="secondary"
                  >
                    {tag.name}
                  </Badge>
                </Link>
                {!!(tag.longName || tag.description) && (
                  <TooltipX id={`#tag-${tag.id}`}>{tag.description || tag.longName}</TooltipX>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Read in other languages */}
        {(!!vi || !!en || !!fr) && (
          <div className="flex flex-row items-center gap-2">
            {!!vi && (
              <Button className="h-8 px-3" size="sm" variant="outline">
                <Link className="flex flex-row items-center gap-2" href={getUri('note', vi)!}>
                  <Languages size={14} />
                  Read this post in Vietnamese
                </Link>
              </Button>
            )}
            {!!en && (
              <Button className="h-8 px-3" size="sm" variant="outline">
                <Link className="flex flex-row items-center gap-2" href={getUri('note', en)!}>
                  <Languages size={14} />
                  Read this post in English
                </Link>
              </Button>
            )}
            {!!fr && (
              <Button className="h-8 px-3" size="sm" variant="outline">
                <Link className="flex flex-row items-center gap-2" href={getUri('note', fr)!}>
                  <Languages size={14} />
                  Read this post in French
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </Header>
  )
}

export function SkeletonHeaderPost() {
  return (
    <Header className="flex flex-col items-center gap-4 lg:flex-row">
      <div className="flex w-full shrink-0 flex-row items-center gap-4 lg:w-fit">
        {/* Icon skeleton */}
        <div className="h-[75px] w-[75px] shrink-0 animate-pulse rounded bg-gray-200 lg:h-[150px] lg:w-[150px]" />

        {/* Mobile title skeleton */}
        <div className="h-8 w-2/3 animate-pulse rounded bg-gray-200 lg:hidden" />
      </div>

      <div className="flex w-full flex-col gap-4">
        {/* Desktop title skeleton */}
        <div className="hidden h-8 w-2/3 animate-pulse rounded-xl bg-gray-200 lg:block" />

        {/* Meta info skeleton (Author + Date) */}
        <div className="flex w-full flex-wrap items-center gap-3">
          <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Tags skeleton */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-6 w-16 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-6 w-20 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-6 w-24 animate-pulse rounded-xl bg-gray-200" />
        </div>

        {/* Language buttons skeleton */}
        <div className="flex flex-row items-center gap-2">
          <div className="h-7 w-52 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
    </Header>
  )
}
