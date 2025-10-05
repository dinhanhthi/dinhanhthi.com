'use client'

import cn from 'classnames'
import { ImageProps } from 'next/image'
import Link from 'next/link'
import React from 'react'

import DateComponent from '@/src/components/notion/DateComponent'
import Excerpt from '@/src/components/notion/Excerpt'
import PostFeaturedImage from '@/src/components/notion/PostFeaturedImage'
import { CommonPostTypeOpts } from '@/src/components/notion/PostsList'
import AiOutlineClockCircle from '@/src/components/icons/AiOutlineClockCircle'
import { Post } from '@/src/lib/types'
import { usePostDateStatus } from '@/src/hooks/usePostDateStatus'

export type PostCardWhiteBgBigOpts = {
  hideDate?: boolean
  hideAuthor?: boolean
  hideExcerpt?: boolean
  imageProps?: Partial<ImageProps>
} & CommonPostTypeOpts

type PostCardWhiteBgBigProps = {
  post: Post
  options?: PostCardWhiteBgBigOpts
}

export const CWBBHeightClass = 'h-36'

export default function PostCardWhiteBgBig(props: PostCardWhiteBgBigProps) {
  const { title, featuredImage, date, uri, excerpt, authors } = props.post
  const options = props.options

  const status = usePostDateStatus(
    props.post.createdDate!,
    props.post.date!,
    options?.maxDaysWinthin || 7
  )

  return (
    <div className="group overflow-hidden rounded-md bg-white shadow-lg h-full">
      <Link className={cn(options?.fontClassName, 'text-center')} href={uri || '/'}>
        <div className="flex flex-col justify-center">
          <div className={cn('relative w-full overflow-hidden', CWBBHeightClass)}>
            {(status === 'new' || status === 'updatedWithin') && (
              <div
                className={cn(
                  'absolute bottom-4 left-0 z-10 text-[0.8rem] py-[1px] pl-2 pr-4',
                  'rounded-r-md',
                  {
                    'bg-green-200 text-green-900': status === 'updatedWithin',
                    'bg-amber-200 text-amber-900': status === 'new'
                  }
                )}
              >
                {status === 'new' && (props.options?.newLabel || 'new')}
                {status === 'updatedWithin' && (props.options?.updatedLabel || 'updated')}
              </div>
            )}
            <PostFeaturedImage
              featuredImage={featuredImage}
              title={title}
              imageProps={props.options?.imageProps}
            />
          </div>
        </div>
        <div className="p-4">
          <div className="group-hover:m2it-link-hover text-base font-bold leading-[1.35]">
            {title}
          </div>
          {(!options?.hideDate || !options?.hideAuthor) && !!authors?.length && (
            <div className="flex justify-center gap-2 p-2">
              {!options?.hideDate && date && (
                <div className="text-[0.8rem] opacity-80 flex flex-row items-center gap-2 justify-center">
                  <AiOutlineClockCircle />
                  <DateComponent dateString={date} />
                </div>
              )}
              {!options?.hideAuthor && authors?.length && (
                <div className="flex gap-1 text-sm opacity-80 text-emerald-800">
                  {authors?.length > 1 && (
                    <>
                      <i className="icon-users-outline"></i>
                      <span>Nhiều tác giả</span>
                    </>
                  )}
                  {authors?.length <= 1 && (
                    <>
                      <i className="icon-user-outline -mr-1"></i>
                      <span>{authors[0].name}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          {!options?.hideExcerpt && excerpt && (
            <div className="pt-2 text-[0.8rem] opacity-80 group-hover:opacity-100">
              <Excerpt excerpt={excerpt} defaultExcerpt="Một bài viết trên Math2IT"></Excerpt>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}

export const PostCardWhiteBgBigSkeleton = (props: { postContainerClassName?: string }) => (
  <div className={cn('flex flex-col justify-center', props.postContainerClassName)}>
    <div className={cn('w-full rounded-xl bg-slate-200', CWBBHeightClass)}></div>
    <div className="flex flex-col items-center gap-1 p-2">
      <div className="h-4 w-full rounded-xl bg-slate-200"></div>

      {/* excerpt */}
      <div className="w-full mt-2 px-2 flex flex-col items-center gap-1">
        <div className="h-2 w-full rounded-xl bg-slate-200"></div>
        <div className="h-2 w-full rounded-xl bg-slate-200"></div>
        <div className="h-2 w-3/4 rounded-xl bg-slate-200"></div>
      </div>
    </div>
  </div>
)
