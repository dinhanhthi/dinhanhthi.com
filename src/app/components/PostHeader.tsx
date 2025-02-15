'use client'

import PostHeaderTopics from '@notion-x/src/components/PostHeaderTopics'
import SimpleImage from '@notion-x/src/components/SimpleImage'
import { ImagePlaceholderPostHeader } from '@notion-x/src/components/image-placeholders'
import { PageIcon } from '@notion-x/src/components/page-icon'
import { Text } from '@notion-x/src/components/text'
import AiOutlineClockCircle from '@notion-x/src/icons/AiOutlineClockCircle'
import HiMiniCheckBadge from '@notion-x/src/icons/HiMiniCheckBadge'
import RiUser3Line from '@notion-x/src/icons/RiUser3Line'
import { useNotionContext } from '@notion-x/src/lib/context'
import { usePostDateStatus } from '@notion-x/src/lib/hooks'
import cn from 'classnames'
import { get } from 'lodash'
import dynamic from 'next/dynamic'
import { ExtendedRecordMap } from 'notion-types'
import { getTextContent } from 'notion-utils'
import { Suspense } from 'react'

import TooltipX from '@notion-x/src/components/tooltip-x'
import Link from 'next/link'
import me from '../../data/me'
import { exPost } from '../../interface'
import MdEditNote from '../icons/MdEditNote'
import { defaultPostTypeOpts } from '../lib/config'
import { quicksand } from '../lib/fonts'
import { getUri } from '../lib/helpers'
import Header from './Header'

const DateComponent = dynamic(() => import('@notion-x/src/components/DateComponent'), {
  ssr: false,
  loading: () => <div className="animate-pulse w-36 h-4 bg-slate-200 rounded-md" />
})

export const fullWidthPostCoverHeight = 'h-[25vh] max-h-[25vh] min-h-[25vh]'
export const gapHeaderItems = 'mb-3'

type PostHeaderProps = {
  recordMap: ExtendedRecordMap
  postProps: exPost
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
        <div className="flex w-full items-center justify-center h-[25vh] max-h-[25vh] min-h-[25vh]">
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
        <div className="py-8 flex flex-col gap-5 w-full overflow-hidden md:overflow-visible">
          <div className={cn('flex flex-col items-center sm:flex-row sm:items-start gap-3')}>
            {/* icon */}
            {icon && (
              <Suspense
                fallback={
                  <div
                    className={cn('w-[38px] h-[38px] bg-slate-600 rounded-full animate-pulse')}
                  />
                }
              >
                <PageIcon block={block} inline={false} inputIcon={customEmojiUrl} />
              </Suspense>
            )}

            {/* Title */}
            <h1
              className={cn(
                'inline items-baseline gap-2 text-2xl sm:text-3xl leading-tight text-center md:text-left thi-text-rainbow font-bold',
                quicksand.className
              )}
            >
              <Text value={title} block={block} />
            </h1>
          </div>

          {/* Authors & Date & meta */}
          {!props.hideMeta && (
            <div className="flex w-full flex-wrap gap-3 md:w-auto md:flex-nowrap items-center justify-center sm:justify-start text-slate-100">
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
                <MdEditNote className={cn('text-[#dadada] inline-block text-[1.3rem] mt-[-3px]')} />
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
                <div className="px-3 py-0.5 text-[0.8rem] rounded-xl whitespace-nowrap bg-slate-100 text-slate-700">
                  draft
                </div>
              )}

              {status !== 'normal' && (
                <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                  {/* Updated */}
                  {['updated', 'updatedWithin'].includes(status) && (
                    <div
                      className={cn(
                        'px-3 py-0.5 text-sm items-start rounded-xl whitespace-nowrap',
                        {
                          'text-slate-700 bg-slate-100': status === 'updated',
                          'text-green-900 bg-green-200': status === 'updatedWithin'
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
                    <div className="px-3 py-0.5 text-[0.8rem] rounded-xl whitespace-nowrap bg-amber-200 text-amber-900">
                      new
                    </div>
                  )}
                </div>
              )}
              {/* Well written */}
              {wellWritten && (
                <>
                  <div id={`well-written-${block.id}`} className="flex items-center justify-center">
                    <HiMiniCheckBadge className="text-[#dadada] inline-block text-xl mt-[-3px]" />
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
            <div className="justify-center sm:justify-start flex flex-wrap items-center">
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
            <div className="flex items-center gap-2 flex-row">
              {language && language !== 'en' && (
                <>
                  <div
                    id={`lang-${block.id}`}
                    className="text-slate-200 border rounded-md w-fit px-2 text-sm border-slate-200"
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
                <Link
                  className="bg-rose-200 text-sm rounded-md text-rose-900 px-2 border-rose-200 hover:-translate-y-0.5 transition-all duration-200"
                  href={getUri('note', vi)!}
                >
                  Read in Vietnamese
                </Link>
              )}
              {!!en && (
                <Link
                  className="bg-sky-200 text-sm rounded-md text-sky-900 px-2 border-sky-200 hover:-translate-y-0.5 transition-all duration-200"
                  href={getUri('note', en)!}
                >
                  Read in English
                </Link>
              )}
              {!!fr && (
                <Link
                  className="bg-green-200 text-sm rounded-md text-green-900 px-2 border-green-200 hover:-translate-y-0.5 transition-all duration-200"
                  href={getUri('note', fr)!}
                >
                  Read in French
                </Link>
              )}
            </div>
          )}
        </div>
      </Header>
    </>
  )
}
