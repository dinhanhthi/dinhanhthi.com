'use client'

import cn from 'classnames'
import Link from 'next/link'
import React from 'react'

import DateComponent from '@/src/app/components/DateComponent'
import DraftBadgeComponent from '@/src/app/components/DraftBadge'
import LangBadgeComponent from '@/src/app/components/LangBadge'
import { CommonPostTypeOpts } from '@/src/app/components/PostsList'
import TooltipX from '@/src/app/components/tooltip-x'
import BlogIcon from '@/src/app/icons/BlogIcon'
import BsPinAngleFill from '@/src/app/icons/BsPinAngleFill'
import HiMiniCheckBadge from '@/src/app/icons/HiMiniCheckBadge'
import HiOutlineDocumentText from '@/src/app/icons/HiOutlineDocumentText'
import { Post } from '@/src/lib/types'
import { usePostDateStatus } from '@/src/hooks/usePostDateStatus'

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
        className={cn(options?.fontClassName, 'flex items-start gap-3 px-4 py-3.5 ')}
        href={post.uri || '/'}
      >
        <div className={cn('text-slate-600 relative')} id={`well-blog-${post.id}`}>
          {!!options?.customIcon && (!options.showPinned || !post.pinned) && options.customIcon}
          {!options?.customIcon && (!options?.showPinned || !post.pinned) && (
            <>
              {!post.blog && <HiOutlineDocumentText className="text-xl" />}
              {post.blog && <BlogIcon className="text-xl text-slate-600" />}
            </>
          )}
          {options?.showPinned && post.pinned && <BsPinAngleFill className="text-xl" />}
          {post.wellWritten && !post.blog && (
            <span className="bg-transparent absolute bottom-[-5px] right-[-5px]">
              <HiMiniCheckBadge className={cn('text-gray-400 text-sm')} />
            </span>
          )}
        </div>
        {(post.wellWritten || post.blog) && (
          <TooltipX id={`#well-blog-${post.id}`}>
            {post.blog
              ? options?.blogLabel ?? 'A blog post' // Must come before wellWritten
              : post.wellWritten
              ? options?.wellWrittenLabel ?? 'Well written, verified by the author'
              : undefined}
          </TooltipX>
        )}

        <div className="flex flex-1 items-start justify-between gap-x-3 gap-y-1.5 flex-col md:flex-row">
          <h3 className="flex-1">
            {/* date status on mobile size */}
            {post.date && (status === 'updatedWithin' || status === 'new') && (
              <span
                className={cn(
                  'inline-flex md:hidden mr-1.5 px-2 py-0.5 text-[0.7rem] rounded-md whitespace-nowrap gap-1 items-center',
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
            <div className="gap-2 items-center hidden md:flex">
              {['updated', 'updatedWithin'].includes(status) && post.date && (
                <div
                  className={cn('px-3 py-0.5 rounded-md whitespace-nowrap gap-1 items-center', {
                    'bg-slate-200 text-slate-800 text-[0.75rem]':
                      status === 'updated' && !options?.autoHideAddedDate,
                    'text-slate-500 text-[0.8rem]':
                      status === 'updated' && options?.autoHideAddedDate,
                    'bg-green-200 text-green-900 text-[0.75rem]': status === 'updatedWithin'
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
                <div className="px-3 py-0.5 text-[0.75rem] rounded-md whitespace-nowrap bg-amber-200 text-amber-900">
                  {options?.newLabel || 'new'}
                </div>
              )}
              {!(options?.autoHideAddedDate && status !== 'normal') &&
                post.createdDate &&
                !options?.hideOldDate && (
                  <DateComponent
                    className="text-[0.8rem] text-slate-500 group-hover:text-slate-700 hidden md:flex"
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
  <div className={cn('flex items-center gap-3 py-3 px-2', props.postContainerClassName)}>
    <div>
      <HiOutlineDocumentText className="text-xl text-slate-700" />
    </div>
    <div className="flex-1 flex justify-start">
      <div className="h-6 w-3/4 rounded-xl bg-slate-200"></div>
    </div>
    <div className="h-4 w-[150px] rounded-xl bg-slate-200"></div>
  </div>
)
