import cn from 'classnames'
import { StaticImageData } from 'next/image'

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
          className={cn('object-cover duration-500 group-hover:scale-105', {
            'blur-sm': !!props.bookCover,
            // Fix: blur image problem on the edge of the image
            'w-full': !props.bookCover,
            '!top-[-5px] !left-[-5px] !h-[calc(100%+10px)] !w-[calc(100%+10px)] !max-w-[calc(100%+10px)]':
              !!props.bookCover
          })}
          imageProps={{
            fill: true
          }}
        />
        {props.bookCover && (
          <div
            className={cn('absolute top-0 left-0 flex h-full w-full items-center justify-center')}
          >
            <ImageComponent
              image={props.bookCover}
              alt={props.altBookCover || `Book cover of ${props.alt}`}
              className={cn('h-4/5 w-auto rounded-md shadow-xl')}
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
