'use client'

import Image, { ImageProps, StaticImageData } from 'next/image'

import { ImageType } from '@/src/lib/types'

type ImageComponentProps = {
  image?: ImageType
  defaultImage?: StaticImageData
  alt?: string
  className?: string
  imageProps?: Partial<ImageProps>
}

/**
 * This component is used for all image-related purposes.
 * For example, featured images, book cover image, notion-block's images, etc.
 */
export default function ImageComponent(props: ImageComponentProps) {
  const image = () =>
    props.image?.staticImageData ? (
      <Image
        alt={props.alt || 'Unnamed image'}
        src={props.image.staticImageData}
        className={props.className}
        {...props.imageProps}
      />
    ) : props.image?.sourceUrl && props.image?.blurDataURL ? (
      <Image
        alt={props.alt || 'Unnamed image'}
        src={props.image.sourceUrl}
        className={props.className}
        placeholder="blur"
        blurDataURL={props.image.blurDataURL}
        {...props.imageProps}
      />
    ) : props.defaultImage ? (
      <Image
        alt={props.alt || 'Unnamed image'}
        src={props.defaultImage}
        className={props.className}
        {...props.imageProps}
      />
    ) : null

  return <>{image()}</>
}
