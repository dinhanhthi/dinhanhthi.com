'use client'

/* eslint-disable @next/next/no-img-element */
import cn from 'classnames'
import { isNumber } from 'lodash'
import { PreviewImage } from 'notion-types'
import { normalizeUrl } from 'notion-utils'
import * as React from 'react'
import { ImageState, LazyImageFull } from 'react-lazy-images'

import AiOutlineLoading3Quarters from '@/src/app/icons/AiOutlineLoading3Quarters'
import { useNotionContext } from '@/src/lib/notion/context'
import { cs } from '@/src/lib/notion/utils'
import SimpleImage, { SimpleImageProps } from './SimpleImage'

/**
 * Progressive, lazy images modeled after Medium's LQIP technique.
 */
export const LazyImage: React.FC<{
  src?: string
  alt?: string
  className?: string
  style?: React.CSSProperties
  height?: number
  zoomable?: boolean
  priority?: boolean
  customPreviewImage?: PreviewImage
  useSimpleImage?: boolean
  simpleImageProps?: SimpleImageProps
}> = ({
  src,
  alt,
  className,
  customPreviewImage,
  style,
  zoomable = false,
  priority = false,
  height,
  useSimpleImage = false,
  simpleImageProps,
  ...rest
}) => {
  const { recordMap, zoom, previewImages, forceCustomImages, components } = useNotionContext()

  const zoomRef = React.useRef(zoom ? zoom.clone() : null)
  const previewImage = customPreviewImage
    ? customPreviewImage
    : previewImages
    ? recordMap?.preview_images?.[src as any] ?? recordMap?.preview_images?.[normalizeUrl(src)]
    : null

  const onLoad = React.useCallback(
    (e: any) => {
      if (zoomable && (e.target.src || e.target.srcset)) {
        if (zoomRef.current) {
          ;(zoomRef.current as any).attach(e.target)
        }
      }
    },
    [zoomRef, zoomable]
  )

  const attachZoom = React.useCallback(
    (image: any) => {
      if (zoomRef.current && image) {
        ;(zoomRef.current as any).attach(image)
      }
    },
    [zoomRef]
  )

  const attachZoomRef = React.useMemo(
    () => (zoomable ? attachZoom : undefined),
    [zoomable, attachZoom]
  )

  if (previewImage) {
    const aspectRatio = previewImage.originalHeight / previewImage.originalWidth

    if (components.Image) {
      // TODO: could try using next/image onLoadComplete to replace LazyImageFull
      // while retaining our blur implementation
      return (
        <components.Image
          src={src}
          alt={alt}
          style={style}
          className={className}
          width={previewImage.originalWidth}
          height={previewImage.originalHeight}
          blurDataURL={previewImage.dataURIBase64}
          placeholder="blur"
          priority={priority}
          onLoad={onLoad}
        />
      )
    }

    return (
      <>
        {/* @ts-expect-error Client Component */}
        <LazyImageFull src={src as any} {...rest} experimentalDecode={true}>
          {({ imageState, ref }) => {
            const isLoaded = imageState === ImageState.LoadSuccess
            const wrapperStyle: React.CSSProperties = {
              width: '100%'
            }
            const imgStyle: React.CSSProperties = {}

            if (height) {
              wrapperStyle.height = height
            } else {
              imgStyle.position = 'absolute'
              wrapperStyle.paddingBottom = `${aspectRatio * 100}%`
            }

            return (
              <div
                className={cs('lazy-image-wrapper', isLoaded && 'lazy-image-loaded', className)}
                style={wrapperStyle}
              >
                <img
                  className="lazy-image-preview"
                  src={previewImage.dataURIBase64}
                  alt={alt}
                  ref={ref}
                  style={style}
                  decoding="async"
                />

                <img
                  className="lazy-image-real"
                  src={src}
                  alt={alt}
                  ref={attachZoomRef}
                  style={{
                    ...style,
                    ...imgStyle
                  }}
                  width={previewImage.originalWidth}
                  height={previewImage.originalHeight}
                  decoding="async"
                  loading="lazy"
                />
              </div>
            )
          }}
        </LazyImageFull>
      </>
    )
  } else {
    // TODO: GracefulImage doesn't seem to support refs, but we'd like to prevent
    // invalid images from loading as error states

    /*
      NOTE: Using next/image without a pre-defined width/height is a huge pain in
      the ass. If we have a preview image, then this works fine since we know the
      dimensions ahead of time, but if we don't, then next/image won't display
      anything.

      Since next/image is the most common use case for using custom images, and this
      is likely to trip people up, we're disabling non-preview custom images for now.

      If you have a use case that is affected by this, please open an issue on github.
    */
    if (components.Image && forceCustomImages) {
      return (
        <components.Image
          src={src}
          alt={alt}
          className={className}
          style={style}
          width={null}
          height={height || null}
          priority={priority}
          onLoad={onLoad}
        />
      )
    }

    // Default image element
    return (
      <>
        {!useSimpleImage && (
          <img
            className={className}
            style={style}
            src={src}
            alt={alt}
            ref={attachZoomRef}
            loading="lazy"
            decoding="async"
            {...rest}
          />
        )}
        {useSimpleImage && (
          <SimpleImage
            imagePlaceholder={
              simpleImageProps?.imagePlaceholder ||
              ImagePlaceholder({ height, className, style: simpleImageProps?.style ?? style })
            }
            zoomable={simpleImageProps?.zoomable ?? zoomable}
            src={src!}
            alt={alt}
            className={className}
            style={simpleImageProps?.style ?? style}
          />
        )}
      </>
    )
  }
}

const ImagePlaceholder = (props: {
  width?: string | number
  height?: string | number
  className?: string
  style?: React.CSSProperties
}) => {
  const { width, height } = props
  const widthToUse = width || props.style?.width || '80%'
  const heightToUse = isNumber(height)
    ? height
    : props.style?.height
    ? props.style?.height
    : widthToUse && isNumber(widthToUse)
    ? (widthToUse * 2) / 3
    : '200px'
  return (
    <div
      style={{
        width: widthToUse,
        height: heightToUse
      }}
      className={cn(
        'bg-gray-100 flex items-center justify-center animate-pulse rounded-lg mx-auto',
        'flex items-center flex-col gap-1',
        props.className
      )}
    >
      <AiOutlineLoading3Quarters className="text-[30px] text-slate-400 animate-spin" />
    </div>
  )
}
