import cn from 'classnames'
import { StaticImageData } from 'next/image'
import React from 'react'

import { ImageType } from '@/src/lib/types'
import ImageComponent from './ImageComponent'

type PostHeaderCoverProps = {
  cover: ImageType
  defaultCover: StaticImageData
  alt: string
  coverHeight?: string
  bookCover?: ImageType
  altBookCover?: string
}

export default function PostHeaderCover(props: PostHeaderCoverProps) {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-center',
        props.coverHeight || 'h-[25vh] max-h-[25vh] min-h-[25vh]'
      )}
    >
      {/* 👇 Because Image auto create position absolute, we have to wrap this with a relative div */}
      <div className="relative flex h-full w-full items-center overflow-hidden">
        <ImageComponent
          defaultImage={props.defaultCover}
          image={props.cover}
          alt={props.alt}
          className={cn('object-cover group-hover:scale-105 duration-500', {
            'blur-sm': !!props.bookCover,
            // Fix: blur image problem on the edge of the image
            'w-full': !props.bookCover,
            '!w-[calc(100%+10px)] !max-w-[calc(100%+10px)] !h-[calc(100%+10px)] !left-[-5px] !top-[-5px]':
              !!props.bookCover
          })}
          imageProps={{
            fill: true
          }}
        />
        {props.bookCover && (
          <div
            className={cn('absolute left-0 top-0 flex h-full w-full items-center justify-center')}
          >
            <ImageComponent
              image={props.bookCover}
              alt={props.altBookCover || `Book cover of ${props.alt}`}
              className={cn('rounded-md shadow-xl h-4/5 w-auto')}
              imageProps={{
                width: props.bookCover.width,
                height: props.bookCover.height
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
