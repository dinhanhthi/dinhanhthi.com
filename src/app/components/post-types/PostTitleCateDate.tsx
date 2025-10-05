import cn from 'classnames'
import { ImageProps } from 'next/image'
import Link from 'next/link'
import { getTextContent } from 'notion-utils'
import React from 'react'

import DateComponent from '@/src/app/components/DateComponent'
import PostFeaturedImage from '@/src/app/components/PostFeaturedImage'
import { CommonPostTypeOpts } from '@/src/app/components/PostsList'
import { LazyImage } from '@/src/app/components/lazy-image'
import AiOutlineClockCircle from '@/src/app/icons/AiOutlineClockCircle'
import IoBookOutline from '@/src/app/icons/IoBookOutline'
import { Post } from '@/src/lib/types'
import { usePostDateStatus } from '@/src/hooks/usePostDateStatus'
import { defaultMapImageUrl } from '@/src/lib/notion/map-image-url'

export type PostTitleCateDateOpts = {
  hideCategory?: boolean
  hideDate?: boolean
  defaultCategoryBgColor?: string
  defaultCategoryTextColor?: string
  imageProps?: Partial<ImageProps>
} & CommonPostTypeOpts

type PostTitleCateDateProps = {
  post: Post
  options?: PostTitleCateDateOpts
}

export const TCDFIHeightClass = 'h-28'

export default function PostTitleCateDate(props: PostTitleCateDateProps) {
  const { block, title, rawTitle, featuredImage, pageCover, date, categories, uri } = props.post
  const options = props.options
  const category = categories ? categories[0] : null

  const status = usePostDateStatus(
    props.post.createdDate!,
    props.post.date!,
    options?.maxDaysWinthin || 7
  )

  return (
    <div className="group">
      <Link className={cn(options?.fontClassName, 'text-center')} href={uri || '/'}>
        <div
          className={cn('flex flex-col justify-center overflow-hidden rounded-t-md shadow-sm', {
            'rounded-b-md': !category || options?.hideCategory
          })}
        >
          <div className={cn('relative w-full overflow-hidden', TCDFIHeightClass)}>
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
            {featuredImage && (
              <PostFeaturedImage
                className="duration-300 group-hover:scale-110"
                featuredImage={featuredImage}
                title={title}
                imageProps={props.options?.imageProps}
              />
            )}
            {pageCover && (
              <div className="relative hidden flex-[1_1_100px] sm:block">
                <LazyImage
                  src={defaultMapImageUrl(pageCover, block!)!}
                  alt={getTextContent(rawTitle)}
                  style={{
                    objectFit: 'cover'
                  }}
                />
              </div>
            )}
          </div>
          {!options?.hideCategory && category && (
            <div
              style={{
                backgroundColor: `${
                  category.style?.bgColor || options?.defaultCategoryBgColor || '#eee'
                }`,
                color: `${category.style?.textColor || options?.defaultCategoryTextColor || '#222'}`
              }}
              className={cn('rounded-b-md px-2 py-1 text-xs font-semibold')}
            >
              {category?.name}
            </div>
          )}
        </div>
        <div
          className={cn(
            'group-hover:m2it-link-hover p-2 text-[0.95rem] font-semibold leading-[1.35]'
          )}
        >
          {title}
          {!!props.post.bookCover && (
            <IoBookOutline className="group-hover:m2it-link-hover mb-[2px] ml-2 inline text-sm text-slate-700" />
          )}
        </div>
        {!options?.hideDate && (
          <div className="text-sm opacity-80 flex gap-1 items-center justify-center">
            <AiOutlineClockCircle />
            {date && <DateComponent dateString={date} />}
          </div>
        )}
      </Link>
    </div>
  )
}

export const PostTitleCateDateSkeleton = (props: { postContainerClassName?: string }) => (
  <div className={cn('flex flex-col justify-center', props.postContainerClassName)}>
    <div className={cn('w-full rounded-xl bg-slate-200', TCDFIHeightClass)}></div>
    <div className="flex flex-col items-center gap-1 p-2">
      <div className="h-4 w-full rounded-xl bg-slate-200"></div>
      <div className="h-4 w-3/4 rounded-xl bg-slate-200"></div>
    </div>
  </div>
)
