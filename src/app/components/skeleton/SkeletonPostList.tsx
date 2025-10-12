'use client'

import cn from 'classnames'

import { Carousel, CarouselItem } from '@/src/app/components/Carousel'
import { PostListStyle, PostType, postListGridCLass } from '@/src/app/components/PostsList'
import { PostBlogSimpleSkeleton } from '@/src/app/components/post-types/PostBlogSimple'
import { PostSimpleSkeleton } from '@/src/app/components/post-types/PostSimple'

type SkeletonPostListProps = {
  count: number
  postType?: PostType
  listStyle?: PostListStyle
  options?: {
    className?: string
    postContainerClassName?: string
  }
}

export default function SkeletonPostList(props: SkeletonPostListProps) {
  return (
    <>
      {(!props.listStyle || props.listStyle === 'default') && (
        <div className={cn(props.options?.className || postListGridCLass, 'animate-pulse')}>
          {Array.from({ length: props.count }).map((_, i) =>
            getSkeleton(i, props.postType, props.options?.postContainerClassName)
          )}
        </div>
      )}
      {props.listStyle === 'carousel' && (
        <Carousel
          items={Array.from({ length: props.count }).map((_, i) => ({ id: i }))}
          renderItem={({ item, isSnapPoint }) => (
            <CarouselItem key={item.id} isSnapPoint={isSnapPoint} widthClass={'w-80'}>
              {getSkeleton(item.id, props.postType, props.options?.postContainerClassName)}
            </CarouselItem>
          )}
        />
      )}
    </>
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
