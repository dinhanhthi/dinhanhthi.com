import cn from 'classnames'
import Link from 'next/link'
import React from 'react'

import DateComponent from '@/src/components/notion/DateComponent'
import DraftBadgeComponent from '@/src/components/notion/DraftBadge'
import LangBadgeComponent from '@/src/components/notion/LangBadge'
import { CommonPostTypeOpts } from '@/src/components/notion/PostsList'
import { Post } from '@/src/lib/types'
import { getColorIndex, waveColors } from '@/src/lib/helpers'
import { usePostDateStatus } from '@/src/hooks/usePostDateStatus'

export type PostCardWaveOpts = {
  colorIndex?: number
  humanizeDate?: boolean
  draftLabel?: string
  tooltipDraftLabel?: string
} & CommonPostTypeOpts

type PostCardWaveProps = {
  post: Post
  options?: PostCardWaveOpts
}

export default function PostCardWave(props: PostCardWaveProps) {
  const { post, options } = props
  const status = usePostDateStatus(post.createdDate!, post.date!, options?.maxDaysWinthin || 7)

  return (
    <Link href={props.post.uri || '/'}>
      <div className="post-card-wave group gap-2">
        <div
          className={cn(
            options?.fontClassName,
            'card-title group-hover:m2it-link-hover text-slate-800',
            'leading-[1.35] text-[0.95rem]'
          )}
        >
          {/* title */}
          <span>{props.post.title}</span>

          {/* languages */}
          <LangBadgeComponent post={post} type="written" />
          <LangBadgeComponent post={post} type="available" />

          {/* draft */}
          <DraftBadgeComponent
            post={post}
            draftLabel={options?.draftLabel}
            tooltipDraftLabel={options?.tooltipDraftLabel}
          />
        </div>
        {(post.createdDate || post.date) && (
          <div className="gap-2 items-center">
            {['updated', 'updatedWithin'].includes(status) && post.date && (
              <div
                className={cn(
                  'px-3 py-0.5 text-[0.7rem] rounded-md whitespace-nowrap gap-1 items-center',
                  {
                    'bg-slate-200 text-slate-800': status === 'updated',
                    'bg-green-200 text-green-900': status === 'updatedWithin',
                    'hidden md:flex': status !== 'updatedWithin'
                  }
                )}
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
              <div className="px-3 py-0.5 text-[0.7rem] rounded-md whitespace-nowrap bg-amber-200 text-amber-900">
                {options?.newLabel || 'new'}
              </div>
            )}
          </div>
        )}
        <div className="bottom-wave">
          <svg
            className="waves"
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
                fill={`rgba(${waveColors[getColorIndex(options?.colorIndex)]}, 0.1)`}
                x="48"
                xlinkHref="#gentle-wave"
                y="0"
              ></use>
              <use
                fill={`rgba(${waveColors[getColorIndex(options?.colorIndex)]}, 0.05)`}
                x="48"
                xlinkHref="#gentle-wave"
                y="3"
              ></use>
              <use
                fill={`rgba(${waveColors[getColorIndex(options?.colorIndex)]}, 0.01)`}
                x="48"
                xlinkHref="#gentle-wave"
                y="5"
              ></use>
              <use
                fill={`rgba(${waveColors[getColorIndex(options?.colorIndex)]}, 0.005)`}
                x="48"
                xlinkHref="#gentle-wave"
                y="7"
              ></use>
            </g>
          </svg>
        </div>
      </div>
    </Link>
  )
}

export const PostCardWaveSkeleton = (props: { postContainerClassName?: string }) => (
  <div
    className={cn(
      'flex items-center justify-center w-full rounded-[12px] h-32 shadow-sm',
      props.postContainerClassName
    )}
  >
    <div className="w-full flex flex-col items-center gap-2 p-3">
      <div className="h-4 w-full rounded-xl bg-slate-200"></div>
      <div className="h-4 w-3/4 rounded-xl bg-slate-200"></div>
    </div>
  </div>
)
