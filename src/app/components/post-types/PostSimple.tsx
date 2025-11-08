'use client'

import cn from 'classnames'
import Link from 'next/link'
import React from 'react'

import DateComponent from '@/src/app/components/DateComponent'
import DraftBadgeComponent from '@/src/app/components/DraftBadge'
import LangBadgeComponent from '@/src/app/components/LangBadge'
import { CommonPostTypeOpts } from '@/src/app/components/PostsList'
import TooltipX from '@/src/app/components/tooltip-x'
import { usePostDateStatus } from '@/src/hooks/usePostDateStatus'
import { Post } from '@/src/lib/types'
import { Feather, FileText, Pin } from 'lucide-react'
import { Badge } from '../ui/badge'

export type PostSimpleOpts = {
  hideDate?: boolean
  customIcon?: React.ReactNode
  draftLabel?: string
  tooltipDraftLabel?: string
  humanizeDate?: boolean
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
    <div className="group hover:bg-bg-hover">
      <Link
        className={cn(options?.fontClassName, 'flex items-start gap-3 px-4 py-3.5')}
        href={post.uri || '/'}
      >
        <div
          className={cn('text-muted group-hover:text-text relative')}
          id={`well-blog-${post.id}`}
        >
          {!!options?.customIcon && (!options.showPinned || !post.pinned) && options.customIcon}
          {!options?.customIcon && (!options?.showPinned || !post.pinned) && (
            <>
              {!post.blog && <FileText size={20} />}
              {post.blog && <Feather size={20} />}
            </>
          )}
          {options?.showPinned && post.pinned && <Pin size={18} className="rotate-45" />}
        </div>
        {post.blog && (
          <TooltipX id={`#well-blog-${post.id}`}>{options?.blogLabel ?? 'A blog post'}</TooltipX>
        )}

        <div className="flex flex-1 flex-col items-start justify-between gap-x-3 gap-y-1.5 md:flex-row">
          <h3 className="flex-1">
            {/* date status on mobile size */}
            {post.date && (status === 'updatedWithin' || status === 'new') && (
              <Badge
                variant="secondary"
                className={cn('mr-1.5 !border-none whitespace-nowrap md:hidden', {
                  '!bg-green-bg !text-green-text': status === 'updatedWithin',
                  '!bg-yellow-bg !text-yellow-text': status === 'new'
                })}
              >
                {status === 'updatedWithin' && <>updated</>}
                {status === 'new' && <>new</>}
              </Badge>
            )}
            {/* title */}
            {post.title}

            {/* languages */}
            <LangBadgeComponent post={post} type="written" className="ml-1.5" />
            <LangBadgeComponent post={post} type="available" className="ml-1.5" />

            {/* draft */}
            {post?.isDraft && (
              <DraftBadgeComponent
                className="ml-1.5"
                postId={post.id!}
                draftLabel={options?.draftLabel}
                tooltipDraftLabel={options?.tooltipDraftLabel}
              />
            )}
          </h3>
          {/* date status on big screen */}
          {(post.createdDate || post.date) && (status !== 'updated' || !options?.hideOldDate) && (
            <div className="hidden items-center gap-2 md:flex">
              {['updated', 'updatedWithin'].includes(status) && post.date && (
                <Badge
                  variant="secondary"
                  className={cn('!border-none whitespace-nowrap', {
                    '!bg-green-bg !text-green-text': status === 'updatedWithin'
                  })}
                >
                  <DateComponent
                    dateString={post.date}
                    format="MMM DD, YYYY"
                    humanize={options?.humanizeDate}
                    dateLabel={options?.updatedOnLabel || 'updated'}
                  />
                </Badge>
              )}
              {status === 'new' && (
                <Badge variant="secondary" className="!bg-yellow-bg !text-yellow-text !border-none">
                  {options?.newLabel || 'new'}
                </Badge>
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
  <div
    className={cn('flex animate-pulse items-center gap-3 px-2 py-3', props.postContainerClassName)}
  >
    <FileText className="text-skeleton-bg" size={20} />
    <div className="flex flex-1 justify-start">
      <div className="bg-skeleton-bg h-6 w-3/4 rounded-xl"></div>
    </div>
    <div className="bg-skeleton-bg h-4 w-[150px] rounded-xl"></div>
  </div>
)
