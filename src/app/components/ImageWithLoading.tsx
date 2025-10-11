'use client'

import cn from 'classnames'
import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

export default function ImageWithLoading(props: ImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const { className, onLoad, alt, ...restProps } = props

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageLoaded(true)
    onLoad?.(e)
  }

  return (
    <div
      className="relative"
      style={{
        width: props.width || 'auto',
        height: props.height || 'auto'
      }}
    >
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center rounded bg-gray-100">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-400"></div>
        </div>
      )}
      <Image
        alt={alt || 'Image'}
        {...restProps}
        onLoad={handleLoad}
        className={cn(
          'transition-opacity duration-300',
          imageLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
      />
    </div>
  )
}
