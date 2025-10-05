'use client'

import cn from 'classnames'
import React from 'react'

import { getYoutubeId } from '@/src/lib/notion/utils'
import YoutubeEmbed from './YoutubeEmbed'

type BlockVideoProps = {
  caption: React.ReactNode
  videoUrl: string
  className?: string
  updatedBlock?: React.ReactElement
}

export default function BlockVideo(props: BlockVideoProps) {
  const videoId = getYoutubeId(props.videoUrl)
  if (!videoId) return null
  return (
    <div className={cn(props.className, 'flex flex-col justify-center items-center gap-2')}>
      {props.updatedBlock}
      <div className="w-full">
        <YoutubeEmbed id={videoId} title={'Youtube video'} className="aspect-video w-full" />
      </div>
      {props.caption && <div className="text-[0.9em] italic opacity-90">{props.caption}</div>}
    </div>
  )
}
