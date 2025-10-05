/* eslint-disable jsx-a11y/alt-text */

/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { Img, ImgProps } from 'react-image'

import { isBrowser } from '@/src/lib/notion/utils'

export const GracefulImage = (props: ImgProps) => {
  if (isBrowser) {
    return <Img {...props} />
  } else {
    return <img {...(props as any)} />
  }
}
