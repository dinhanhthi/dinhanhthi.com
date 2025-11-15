'use client'

import { TechItem } from '@/src/data/techs'
import cn from 'classnames'
import ImageComponent from './ImageComponent'

type BadgeTechBigSimpleProps = {
  className?: string
  tech: TechItem
}

export default function BadgeTechBigSimple(props: BadgeTechBigSimpleProps) {
  return (
    <div
      className={cn(
        'border-border-muted bg-bg-hover flex w-fit items-center justify-center rounded-full border px-4 py-1.5 align-baseline text-sm',
        props.className
      )}
    >
      <ImageComponent
        image={props.tech.icon}
        alt={props.tech.name}
        className={cn('h-6 w-6', props.tech.imgClass)}
        imageProps={{ width: 24, height: 24 }}
      />
      <span className="ml-2 tracking-wide whitespace-nowrap">{props.tech.name}</span>
    </div>
  )
}
