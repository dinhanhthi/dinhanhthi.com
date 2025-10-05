'use client'

/**
 * This component is used for displaying featured image of a post IN A POST LIST ONLY.
 */
import cn from 'classnames'
import { ImageProps, StaticImageData } from 'next/image'
import React from 'react'

import { ImageType } from '@/src/lib/types'
import { defaultBlurData } from '@/src/lib/helpers'
import ImageComponent from './ImageComponent'

type PostFeaturedImageProps = {
  title: string
  featuredImage?: ImageType
  className?: string
  defaultImage?: StaticImageData
  imageProps?: Partial<ImageProps>
}

/**
 * This component is used for displaying featured image of a post IN A POST LIST ONLY.
 */
export default function PostFeaturedImage(props: PostFeaturedImageProps) {
  const { title, featuredImage } = props
  return (
    <>
      <div className="relative flex h-full w-full items-center overflow-hidden">
        <ImageComponent
          defaultImage={props.defaultImage}
          image={featuredImage}
          alt={`Hình đại diện cho bài viết "${title}"`}
          className={cn('object-cover', props.className)}
          imageProps={{
            blurDataURL: defaultBlurData.url,
            width: defaultBlurData.width,
            height: defaultBlurData.height,
            ...props.imageProps
          }}
        />
      </div>
    </>
  )
}
