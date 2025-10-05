'use client'

import cn from 'classnames'

import { ImageType } from '@/src/lib/types'
import ImageComponent from './ImageComponent'
import TooltipX from './tooltip-x'

export type TechItem = {
  id: string
  name: string
  icon: ImageType
  url: string
  imgClass?: string
}

type BadgeTechProps = {
  tech: TechItem
  hideText?: boolean
  useLink?: boolean
  hideTooltip?: boolean
}

export default function BadgeTech(props: BadgeTechProps) {
  const containerClass = cn(
    `flex h-6 w-fit items-center justify-center rounded-md border bg-slate-100 px-1 align-baseline text-base text-[#1e293b] shadow-sm transition duration-200 ease-in-out hover:-translate-y-0.5`
  )

  const children = () => (
    <>
      <ImageComponent
        image={props.tech.icon}
        alt={props.tech.name}
        className={cn('h-[18px] w-[18px]', props.tech.imgClass)}
        imageProps={{ width: 32, height: 32 }}
      />
      {!props.hideText && (
        <span className="ml-1.5 text-[81%] tracking-wide whitespace-nowrap">{props.tech.name}</span>
      )}
    </>
  )

  return (
    <>
      {props.useLink && (
        <a id={`tech-${props.tech.id}`} className={containerClass} href={props.tech.url}>
          {children()}
        </a>
      )}
      {!props.useLink && (
        <div id={`tech-${props.tech.id}`} className={containerClass} data-title={props.tech.name}>
          {children()}
        </div>
      )}
      {!props.hideTooltip && <TooltipX id={`#tech-${props.tech.id}`}>{props.tech.name}</TooltipX>}
    </>
  )
}
