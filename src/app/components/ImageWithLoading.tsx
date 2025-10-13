'use client'

import cn from 'classnames'
import { LoaderCircle } from 'lucide-react'
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
        <div className="dark:bg-bg-hover absolute inset-0 flex animate-pulse items-center justify-center rounded bg-gray-100">
          <LoaderCircle size={48} className="animate-spin text-gray-300 dark:text-gray-500" />
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
