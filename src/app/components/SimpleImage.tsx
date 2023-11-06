'use client'

import cn from 'classnames'
import React, { useEffect, useState } from 'react'

import PiImageSquareDuotone from '../icons/PiImageSquareDuotone'

/* eslint-disable @next/next/no-img-element */

type SimpleImageProps = {
  src: string
  alt?: string
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
  imagePlaceholder?: React.ReactNode
}

export default function SimpleImage(props: SimpleImageProps) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (props.src) {
      const img = new Image()
      img.src = props.src
      img.onload = () => {
        setLoaded(true)
      }
    }
  }, [props.src])

  return (
    <>
      {loaded ? null : (
        <>
          {!!props.imagePlaceholder && props.imagePlaceholder}
          {!props.imagePlaceholder && (
            <div
              style={{
                width: props.width || props.style?.width || 'auto',
                height: props.height || props.style?.height || 'auto'
              }}
              className={cn(
                'bg-gray-100 flex items-center justify-center animate-pulse',
                props.className
              )}
            >
              <PiImageSquareDuotone className="text-[25px] text-slate-400" />
            </div>
          )}
        </>
      )}
      {loaded && (
        <img
          src={props.src}
          alt={props.alt || 'Undefined image name'}
          className={props.className}
          style={{
            ...props.style,
            width: props.width || props.style?.width,
            height: props.height || props.style?.height
          }}
          loading="lazy"
          decoding="async"
        />
      )}
    </>
  )
}
