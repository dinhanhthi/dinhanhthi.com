'use client'

import cn from 'classnames'
import React from 'react'

import PostBlogSimple, {
  PostBlogSimpleOpts,
  PostBlogSimpleSkeleton
} from '@/src/app/components/post-types/PostBlogSimple'
import PostSimple, {
  PostSimpleOpts,
  PostSimpleSkeleton
} from '@/src/app/components/post-types/PostSimple'
import { Post } from '@/src/lib/types'

export type PostType = 'PostSimple' | 'PostBlogSimple'

export type CommonPostTypeOpts = {
  fontClassName?: string
  newLabel?: string
  updatedLabel?: string
  maxDaysWinthin?: number // within how many days to show 'new' or 'updated' label
  updatedOnLabel?: string
  addedOnLabel?: string
}

export type PostTypeOpts = PostSimpleOpts | PostBlogSimpleOpts

type PostListProps = {
  className?: string
  posts: Post[]
  postType: PostType
  postTypeOpts?: PostTypeOpts
  options?: {
    className?: string
  }
  fontClassName?: string
}

export const postListGridCLass = cn(
  'grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 sm:gap-x-4 md:grid-cols-3 xl:grid-cols-4'
)

export default function PostList(props: PostListProps) {
  return (
    <section className={props.className}>
      <div className={props.options?.className || postListGridCLass}>
        {props.posts.map((post, index) => (
          <React.Fragment key={post.uri}>
            {getPostTypeElement(props.postType, post, props.postTypeOpts, index)}
          </React.Fragment>
        ))}
      </div>
    </section>
  )
}

function getPostTypeElement(
  postType: PostType,
  post: Post,
  postTypeOpts?: PostTypeOpts,
  index?: number
) {
  switch (postType) {
    case 'PostSimple':
      return <PostSimple post={post} options={postTypeOpts} />
    case 'PostBlogSimple':
      return <PostBlogSimple post={post} options={{ ...postTypeOpts, colorIndex: index }} />
  }
}

type SkeletonPostListProps = {
  count: number
  postType?: PostType
  className?: string
  postContainerClassName?: string
}

export function SkeletonPostList(props: SkeletonPostListProps) {
  return (
    <div className={cn(props.className || postListGridCLass)}>
      {Array.from({ length: props.count }).map((_, i) =>
        getSkeleton(i, props.postType, props.postContainerClassName)
      )}
    </div>
  )
}

function getSkeleton(key: number | string, postType?: PostType, postContainerClassName?: string) {
  switch (postType) {
    case 'PostSimple':
      return <PostSimpleSkeleton key={key} />

    case 'PostBlogSimple':
      return <PostBlogSimpleSkeleton key={key} postContainerClassName={postContainerClassName} />

    default:
      return <PostSimpleSkeleton key={key} />
  }
}
