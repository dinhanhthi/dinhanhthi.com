'use client'

import PostHeaderTopics from '@/src/app/components/PostHeaderTopics'
import SimpleImage from '@/src/app/components/SimpleImage'
import { ImagePlaceholderPostHeader } from '@/src/app/components/image-placeholders'
import { PageIcon } from '@/src/app/components/page-icon'
import { Text } from '@/src/app/components/text'
import AiOutlineClockCircle from '@/src/app/icons/AiOutlineClockCircle'
import HiMiniCheckBadge from '@/src/app/icons/HiMiniCheckBadge'
import RiUser3Line from '@/src/app/icons/RiUser3Line'
import { useNotionContext } from '@/src/lib/notion/context'
import { usePostDateStatus } from '@/src/hooks/usePostDateStatus'
import cn from 'classnames'
import { get } from 'lodash'
import dynamic from 'next/dynamic'
import { ExtendedRecordMap } from 'notion-types'
import { getTextContent } from 'notion-utils'
import { Suspense } from 'react'

import FR from '@/public/lang/fr.svg'
import EN from '@/public/lang/us.svg'
import VN from '@/public/lang/vn.svg'
import TooltipX from '@/src/app/components/tooltip-x'
import me from '../../data/me'
import { Post } from '@/src/lib/types'
import MdEditNote from '../icons/MdEditNote'
import { defaultPostTypeOpts } from '@/src/lib/config'
import { quicksand } from '@/src/lib/fonts'
import { getUri } from '@/src/lib/helpers'
import BadgeLanguage from './BadgeLanguage'
import Header from './Header'

const DateComponent = dynamic(() => import('@/src/app/components/DateComponent'), {
  ssr: false,
  loading: () => <div className="h-4 w-36 animate-pulse rounded-md bg-slate-200" />
})

export const fullWidthPostCoverHeight = 'h-[25vh] max-h-[25vh] min-h-[25vh]'
export const gapHeaderItems = 'mb-3'

type PostHeaderProps = {
  recordMap: ExtendedRecordMap
  postProps: Post
  hideMeta?: boolean
  discreteStyle?: boolean
}

const pageCoverStyleCache: Record<string, object> = {}

export const containerHeaderClass = 'max-w-full bg-slate-50 drop-shadow-sm py-4'

export default function PostHeader(props: PostHeaderProps) {
  const ctx = useNotionContext()
  const { mapImageUrl } = ctx

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
    pageCover,
    wellWritten,
    language,
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
    <>
      {block?.format?.page_cover && (
        <div className="flex h-[25vh] max-h-[25vh] min-h-[25vh] w-full items-center justify-center">
          <div className="relative flex h-full w-full items-center overflow-hidden">
            <SimpleImage
              src={mapImageUrl(pageCover as any, block)}
              alt={getTextContent(title)}
              className="notion-page-cover absolute"
              imagePlaceholder={ImagePlaceholderPostHeader()}
            />
          </div>
        </div>
      )}

      {/* Main header with infos */}
      <Header headerType={!props.discreteStyle ? 'white' : 'gray'} headerWidth="normal">
        <div className="flex w-full flex-col gap-5 overflow-hidden py-8 md:overflow-visible">
          <div className={cn('flex flex-col items-center gap-3 sm:flex-row sm:items-start')}>
            {/* icon */}
            {icon && (
              <Suspense
                fallback={
                  <div
                    className={cn('h-[38px] w-[38px] animate-pulse rounded-full bg-slate-600')}
                  />
                }
              >
                <PageIcon block={block} inline={false} inputIcon={customEmojiUrl} />
              </Suspense>
            )}

            {/* Title */}
            <h1
              className={cn(
                'thi-text-rainbow inline items-baseline gap-2 text-center text-2xl font-bold leading-tight sm:text-3xl md:text-left',
                quicksand.className
              )}
            >
              <Text value={title} block={block} />
            </h1>
          </div>

          {/* Authors & Date & meta */}
          {!props.hideMeta && (
            <div className="flex w-full flex-wrap items-center justify-center gap-3 text-slate-100 sm:justify-start md:w-auto md:flex-nowrap">
              {/* Author */}
              <div className="flex items-center gap-2 text-base opacity-80">
                <RiUser3Line className="-mr-1" />
                {me.name}
              </div>

              {/* Edit link */}
              <a
                id={`edit-${block.id}`}
                href={`https://www.notion.so/thi-cs/${block.id.replace(/-/g, '')}`}
                target="_blank"
                className="flex items-center justify-center"
              >
                <MdEditNote className={cn('mt-[-3px] inline-block text-[1.3rem] text-[#dadada]')} />
              </a>
              <TooltipX id={`#edit-${block.id}`}>Edit this note (for me only)</TooltipX>

              {/* added */}
              <div className="flex items-center gap-1 text-base opacity-80">
                <AiOutlineClockCircle />
                <DateComponent
                  humanize={true}
                  dateString={createdDate!}
                  dateLabel="added"
                  format="MMM DD, YYYY"
                />
              </div>

              {/* draft */}
              {isDraft && (
                <div className="whitespace-nowrap rounded-xl bg-slate-100 px-3 py-0.5 text-[0.8rem] text-slate-700">
                  draft
                </div>
              )}

              {status !== 'normal' && (
                <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                  {/* Updated */}
                  {['updated', 'updatedWithin'].includes(status) && (
                    <div
                      className={cn(
                        'items-start whitespace-nowrap rounded-xl px-3 py-0.5 text-sm',
                        {
                          'bg-slate-100 text-slate-700': status === 'updated',
                          'bg-green-200 text-green-900': status === 'updatedWithin'
                        }
                      )}
                    >
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
                    <div className="whitespace-nowrap rounded-xl bg-amber-200 px-3 py-0.5 text-[0.8rem] text-amber-900">
                      new
                    </div>
                  )}
                </div>
              )}
              {/* Well written */}
              {wellWritten && (
                <>
                  <div id={`well-written-${block.id}`} className="flex items-center justify-center">
                    <HiMiniCheckBadge className="mt-[-3px] inline-block text-xl text-[#dadada]" />
                  </div>
                  <TooltipX id={`#well-written-${block.id}`}>
                    Well written, verified by the author.
                  </TooltipX>
                </>
              )}
            </div>
          )}

          {/* Tags */}
          {tags && !!tags.length && (
            <div className="flex flex-wrap items-center justify-center sm:justify-start">
              <PostHeaderTopics
                className="justify-center sm:justify-start"
                tags={tags}
                TiTagClass="text-slate-100"
                tagClass="text-slate-700 bg-slate-50"
              />
            </div>
          )}

          {/* Language */}
          {((language && language !== 'en') || !!vi || !!en || !!fr) && (
            <div className="flex flex-row items-center justify-center gap-2 sm:justify-start">
              {language && language !== 'en' && (
                <>
                  <div
                    id={`lang-${block.id}`}
                    className="w-fit rounded-md border border-slate-200 px-2 text-sm text-slate-200"
                  >
                    {language === 'vi' ? 'Vietnamese' : 'French'}
                  </div>
                  <TooltipX id={`#lang-${block.id}`}>
                    {language === 'vi' && 'This post is written in Vietnamese'}
                    {language === 'fr' && 'This post is written in French'}
                  </TooltipX>
                </>
              )}
              {!!vi && (
                <BadgeLanguage
                  id="lang-vn"
                  icon={VN}
                  url={getUri('note', vi)!}
                  title="Read in Vietnamese"
                />
              )}
              {!!en && (
                <BadgeLanguage
                  id="lang-en"
                  icon={EN}
                  url={getUri('note', en)!}
                  title="Read in English"
                />
              )}
              {!!fr && (
                <BadgeLanguage
                  id="lang-fr"
                  icon={FR}
                  url={getUri('note', fr)!}
                  title="Read in French"
                />
              )}
            </div>
          )}
        </div>
      </Header>
    </>
  )
}
