'use client'

import cn from 'classnames'
import { User, Users } from 'lucide-react'
import { ImageProps } from 'next/image'
import Link from 'next/link'

import DateComponent from '@/src/app/components/DateComponent'
import Excerpt from '@/src/app/components/Excerpt'
import PostFeaturedImage from '@/src/app/components/PostFeaturedImage'
import { CommonPostTypeOpts } from '@/src/app/components/PostsList'
import AiOutlineClockCircle from '@/src/app/icons/AiOutlineClockCircle'
import { usePostDateStatus } from '@/src/hooks/usePostDateStatus'
import { Post } from '@/src/lib/types'

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
    <div className="group h-full overflow-hidden rounded-md bg-white shadow-lg">
      <Link className={cn(options?.fontClassName, 'text-center')} href={uri || '/'}>
        <div className="flex flex-col justify-center">
          <div className={cn('relative w-full overflow-hidden', CWBBHeightClass)}>
            {(status === 'new' || status === 'updatedWithin') && (
              <div
                className={cn(
                  'absolute bottom-4 left-0 z-10 py-[1px] pr-4 pl-2 text-[0.8rem]',
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
          <div className="group-hover:m2it-link-hover text-base leading-[1.35] font-bold">
            {title}
          </div>
          {(!options?.hideDate || !options?.hideAuthor) && !!authors?.length && (
            <div className="flex justify-center gap-2 p-2">
              {!options?.hideDate && date && (
                <div className="flex flex-row items-center justify-center gap-2 text-[0.8rem] opacity-80">
                  <AiOutlineClockCircle />
                  <DateComponent dateString={date} />
                </div>
              )}
              {!options?.hideAuthor && authors?.length && (
                <div className="flex gap-1 text-sm text-emerald-800 opacity-80">
                  {authors?.length > 1 && (
                    <>
                      <Users className="h-4 w-4" />
                      <span>Nhiều tác giả</span>
                    </>
                  )}
                  {authors?.length <= 1 && (
                    <>
                      <User className="h-4 w-4" />
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
      <div className="mt-2 flex w-full flex-col items-center gap-1 px-2">
        <div className="h-2 w-full rounded-xl bg-slate-200"></div>
        <div className="h-2 w-full rounded-xl bg-slate-200"></div>
        <div className="h-2 w-3/4 rounded-xl bg-slate-200"></div>
      </div>
    </div>
  </div>
)
