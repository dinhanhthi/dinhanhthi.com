'use client'

import cn from 'classnames'
import Link from 'next/link'
import React from 'react'

import DateComponent from '@/src/app/components/DateComponent'
import DraftBadgeComponent from '@/src/app/components/DraftBadge'
import LangBadgeComponent from '@/src/app/components/LangBadge'
import { CommonPostTypeOpts } from '@/src/app/components/PostsList'
import TooltipX from '@/src/app/components/tooltip-x'
import HiOutlineDocumentText from '@/src/app/icons/HiOutlineDocumentText'
import { usePostDateStatus } from '@/src/hooks/usePostDateStatus'
import { Post } from '@/src/lib/types'
import { BadgeCheck, Feather, Pin } from 'lucide-react'

export type PostSimpleOpts = {
  hideDate?: boolean
  customIcon?: React.ReactNode
  draftLabel?: string
  tooltipDraftLabel?: string
  humanizeDate?: boolean
  wellWrittenLabel?: string
  blogLabel?: string
  showPinned?: boolean
  maxDaysWinthin?: number
  autoHideAddedDate?: boolean // when "new" or "updated" status is shown, hide the added date
  hideOldDate?: boolean // hide the date if it's older than maxDaysWinthin
} & CommonPostTypeOpts

type PostSimpleProps = {
  post: Post
  options?: PostSimpleOpts
}

export default function PostSimple(props: PostSimpleProps) {
  const { post, options } = props
  const status = usePostDateStatus(post.createdDate!, post.date!, options?.maxDaysWinthin || 7)

  return (
    <div className="group hover:bg-slate-50">
      <Link
        className={cn(options?.fontClassName, 'flex items-start gap-3 px-4 py-3.5')}
        href={post.uri || '/'}
      >
        <div className={cn('relative text-slate-600')} id={`well-blog-${post.id}`}>
          {!!options?.customIcon && (!options.showPinned || !post.pinned) && options.customIcon}
          {!options?.customIcon && (!options?.showPinned || !post.pinned) && (
            <>
              {!post.blog && <HiOutlineDocumentText className="text-xl" />}
              {post.blog && <Feather size={20} className="text-slate-600" />}
            </>
          )}
          {options?.showPinned && post.pinned && <Pin size={18} className="rotate-45" />}
          {post.wellWritten && !post.blog && (
            <span className="absolute right-[-5px] bottom-[-5px] bg-transparent">
              <BadgeCheck className="fill-muted text-white" size={12} />
            </span>
          )}
        </div>
        {(post.wellWritten || post.blog) && (
          <TooltipX id={`#well-blog-${post.id}`}>
            {post.blog
              ? (options?.blogLabel ?? 'A blog post') // Must come before wellWritten
              : post.wellWritten
                ? (options?.wellWrittenLabel ?? 'Well written, verified by the author')
                : undefined}
          </TooltipX>
        )}

        <div className="flex flex-1 flex-col items-start justify-between gap-x-3 gap-y-1.5 md:flex-row">
          <h3 className="flex-1">
            {/* date status on mobile size */}
            {post.date && (status === 'updatedWithin' || status === 'new') && (
              <span
                className={cn(
                  'mr-1.5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.7rem] whitespace-nowrap md:hidden',
                  {
                    'bg-green-200 text-green-900': status === 'updatedWithin',
                    'bg-amber-200 text-amber-900': status === 'new'
                  }
                )}
              >
                {status === 'updatedWithin' && <>updated</>}
                {status === 'new' && <>new</>}
              </span>
            )}
            {/* title */}
            {post.title}

            {/* languages */}
            <LangBadgeComponent post={post} type="written" />
            <LangBadgeComponent post={post} type="available" />

            {/* draft */}
            <DraftBadgeComponent
              post={post}
              draftLabel={options?.draftLabel}
              tooltipDraftLabel={options?.tooltipDraftLabel}
            />
          </h3>
          {/* date status on big screen */}
          {(post.createdDate || post.date) && (status !== 'updated' || !options?.hideOldDate) && (
            <div className="hidden items-center gap-2 md:flex">
              {['updated', 'updatedWithin'].includes(status) && post.date && (
                <div
                  className={cn('items-center gap-1 rounded-md px-3 py-0.5 whitespace-nowrap', {
                    'bg-slate-200 text-[0.75rem] text-slate-800':
                      status === 'updated' && !options?.autoHideAddedDate,
                    'text-[0.8rem] text-slate-500':
                      status === 'updated' && options?.autoHideAddedDate,
                    'bg-green-200 text-[0.75rem] text-green-900': status === 'updatedWithin'
                  })}
                >
                  <DateComponent
                    dateString={post.date}
                    format="MMM DD, YYYY"
                    humanize={options?.humanizeDate}
                    dateLabel={options?.updatedOnLabel || 'updated'}
                  />
                </div>
              )}
              {status === 'new' && (
                <div className="rounded-md bg-amber-200 px-3 py-0.5 text-[0.75rem] whitespace-nowrap text-amber-900">
                  {options?.newLabel || 'new'}
                </div>
              )}
              {!(options?.autoHideAddedDate && status !== 'normal') &&
                post.createdDate &&
                !options?.hideOldDate && (
                  <DateComponent
                    className="hidden text-[0.8rem] text-slate-500 group-hover:text-slate-700 md:flex"
                    dateString={post.createdDate}
                    format="MMM DD, YYYY"
                    humanize={options?.humanizeDate}
                    dateLabel={options?.addedOnLabel || 'added'}
                  />
                )}
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}

export const PostSimpleSkeleton = (props: { postContainerClassName?: string }) => (
  <div className={cn('flex items-center gap-3 px-2 py-3', props.postContainerClassName)}>
    <div>
      <HiOutlineDocumentText className="text-xl text-slate-700" />
    </div>
    <div className="flex flex-1 justify-start">
      <div className="h-6 w-3/4 rounded-xl bg-slate-200"></div>
    </div>
    <div className="h-4 w-[150px] rounded-xl bg-slate-200"></div>
  </div>
)
