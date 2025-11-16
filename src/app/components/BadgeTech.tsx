'use client'

import cn from 'classnames'

import { TechItem } from '@/src/data/techs'
import ImageComponent from './ImageComponent'
import TooltipX from './tooltip-x'

type BadgeTechProps = {
  tech: TechItem
  hideText?: boolean
  useLink?: boolean
  hideTooltip?: boolean
}

export default function BadgeTech(props: BadgeTechProps) {
  const containerClass =
    'border-border-muted bg-bg-hover text-text-heading flex h-8 min-w-8 w-fit items-center justify-center rounded-md border px-1 align-baseline text-base transition duration-200 ease-in-out hover:-translate-y-0.5'

  const elementId = props.hideTooltip ? `tech-no-tooltip-${props.tech.id}` : `tech-${props.tech.id}`

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
        <a
          id={elementId}
          className={containerClass}
          href={props.tech.url}
          {...(!props.hideTooltip && { 'data-title': props.tech.name })}
        >
          {children()}
        </a>
      )}
      {!props.useLink && (
        <div
          id={elementId}
          className={containerClass}
          {...(!props.hideTooltip && { 'data-title': props.tech.name })}
        >
          {children()}
        </div>
      )}
      {!props.hideTooltip && <TooltipX id={`#tech-${props.tech.id}`}>{props.tech.name}</TooltipX>}
    </>
  )
}
