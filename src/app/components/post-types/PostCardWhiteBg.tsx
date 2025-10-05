import cn from 'classnames'
import { ImageProps } from 'next/image'
import Link from 'next/link'
import React from 'react'

import DateComponent from '@/src/app/components/DateComponent'
import PostFeaturedImage from '@/src/app/components/PostFeaturedImage'
import { CommonPostTypeOpts } from '@/src/app/components/PostsList'
import { Post } from '@/src/lib/types'

export type PostCardWhiteBgOpts = {
  hideDate?: boolean
  imageProps?: Partial<ImageProps>
} & CommonPostTypeOpts

type PostTitleCateDateProps = {
  post: Post
  options?: PostCardWhiteBgOpts
}

export default function PostCardWhiteBg(props: PostTitleCateDateProps) {
  const { title, featuredImage, date, uri } = props.post
  return (
    <div className="group overflow-hidden rounded-md bg-white shadow-lg">
      <Link className={cn(props.options?.fontClassName, 'text-center')} href={uri || '/'}>
        <div className="flex flex-col justify-center ">
          <div className="relative h-28 w-full overflow-hidden ">
            <PostFeaturedImage
              featuredImage={featuredImage}
              title={title}
              imageProps={props.options?.imageProps}
            />
          </div>
        </div>
        <div className="group-hover:m2it-link-hover px-4 py-3 text-base font-bold">{title}</div>
        {!props.options?.hideDate && date && (
          <div className="px-2 pb-4 text-sm opacity-80">
            <DateComponent dateString={date} />
          </div>
        )}
      </Link>
    </div>
  )
}
