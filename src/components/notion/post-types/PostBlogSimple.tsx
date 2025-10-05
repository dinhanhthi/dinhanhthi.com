import cn from 'classnames'
import Link from 'next/link'
import React from 'react'
import DateComponent from '@/src/components/notion/DateComponent'
import DraftBadgeComponent from '@/src/components/notion/DraftBadge'
import { default as LangBadgeComponent } from '@/src/components/notion/LangBadge'
import { CommonPostTypeOpts } from '@/src/components/notion/PostsList'
import { Post } from '@/src/lib/notion/interface'
import { getColorIndex, waveColors } from '@/src/lib/helpers'
import { usePostDateStatus } from '@/src/hooks/usePostDateStatus'

export type PostBlogSimpleOpts = {
  colorIndex?: number
  humanizeDate?: boolean
  draftLabel?: string
  tooltipDraftLabel?: string
  autoHideAddedDate?: boolean
  tooltipLanguageLabel?: string
  hideOldDate?: boolean // hide the date if it's older than maxDaysWinthin
} & CommonPostTypeOpts

type PostBlogSimpleProps = {
  post: Post
  options?: PostBlogSimpleOpts
}

export default function PostBlogSimple(props: PostBlogSimpleProps) {
  const { post, options } = props
  const status = usePostDateStatus(post.createdDate!, post.date!, options?.maxDaysWinthin || 7)
  return (
    <Link href={post.uri || '/'}>
      <div className="group flex gap-4 items-center p-4 hover:bg-slate-50">
        <div className="circle-wave w-12 h-12 flex-shrink-0 rounded-full">
          <div className="bottom-wave">
            <svg
              className="waves !h-[45px] !min-h-[50px]"
              preserveAspectRatio="none"
              shapeRendering="auto"
              viewBox="0 24 150 28"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <defs>
                <path
                  d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                  id="gentle-wave"
                ></path>
              </defs>
              <g className="parallax">
                <use
                  fill={`rgba(${waveColors[getColorIndex(options?.colorIndex)]}, 0.2)`}
                  x="48"
                  xlinkHref="#gentle-wave"
                  y="0"
                ></use>
                <use
                  fill={`rgba(${waveColors[getColorIndex(options?.colorIndex)]}, 0.1)`}
                  x="48"
                  xlinkHref="#gentle-wave"
                  y="3"
                ></use>
                <use
                  fill={`rgba(${waveColors[getColorIndex(options?.colorIndex)]}, 0.02)`}
                  x="48"
                  xlinkHref="#gentle-wave"
                  y="5"
                ></use>
                <use
                  fill={`rgba(${waveColors[getColorIndex(options?.colorIndex)]}, 0.03)`}
                  x="48"
                  xlinkHref="#gentle-wave"
                  y="7"
                ></use>
              </g>
            </svg>
          </div>
        </div>
        <div className="flex flex-col gap-1 flex-1">
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
              <span className="text-slate-800">{post.title}</span>

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
          {post.description && <div className="text-sm text-gray-500">{post.description}</div>}
        </div>
      </div>
    </Link>
  )
}

export const PostBlogSimpleSkeleton = (props: { postContainerClassName?: string }) => (
  <div className={cn('flex gap-4 items-center p-4', props.postContainerClassName)}>
    <div className="w-12 h-12 flex-shrink-0 rounded-full bg-slate-200"></div>
    <div className="flex flex-col gap-2 w-full">
      <div className="h-4 w-1/2 rounded-xl bg-slate-200"></div>
      <div className="h-3 w-3/4 rounded-xl bg-slate-200"></div>
    </div>
  </div>
)
