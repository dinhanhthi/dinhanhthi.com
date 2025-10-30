'use client'

import cn from 'classnames'
import React, { useState } from 'react'

import { ChevronRight } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'

type BlockHeadingToggleProps = {
  className?: string
  headingElement: React.ReactElement
  anchorRight?: React.ReactElement
  children: React.ReactNode
  updatedBlock?: React.ReactElement
  headingType?: 'h1' | 'h2' | 'h3'
}

export default function BlockHeadingToggle(props: BlockHeadingToggleProps) {
  const [open, setOpen] = useState(false)
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="relative">
        <div className={cn('flex w-full items-start gap-1', props.className)}>
          {props.updatedBlock}
          <CollapsibleTrigger asChild>
            <button className="hover:bg-bg-hover z-20 rounded-md p-1">
              <ChevronRight
                className={cn('transform text-lg transition-all duration-300 ease-in-out', {
                  'rotate-90': open,
                  'rotate-0': !open
                })}
              />
            </button>
          </CollapsibleTrigger>
          {props.headingElement}
          {props.anchorRight}
        </div>
        <CollapsibleContent>
          <div className="toggle-heading-content-container pl-8">{props.children}</div>
        </CollapsibleContent>
        <div
          className={cn('border-border-muted absolute top-0 left-0 z-10 h-[calc(100%-8px)] w-0', {
            hidden: !open,
            'mt-[20px] ml-[16.5px] border-l-3':
              !props.headingType || props.headingType === 'h2' || props.headingType === 'h1',
            'mt-[15px] ml-[15px] border-l-2': props.headingType === 'h3'
          })}
        ></div>
      </div>
    </Collapsible>
  )
}
