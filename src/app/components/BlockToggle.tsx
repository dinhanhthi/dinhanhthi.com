'use client'

import cn from 'classnames'
import React, { useState } from 'react'

import { basicBlockGap, blockMargin } from '@/src/app/components/block'
import BsFillCaretRightFill from '@/src/app/icons/BsFillCaretRightFill'
import { mapColorClass } from '@/src/lib/helpers'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'

export default function BlockToggle(props: {
  text: React.ReactNode
  color?: string
  children?: React.ReactNode
  className?: string
  updatedBlock?: React.ReactElement
}) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={cn(
        mapColorClass(props.color),
        'toggle-container relative',
        blockMargin,
        props.className
      )}
    >
      {props.updatedBlock}
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button className={cn('toggle-button group flex w-full items-start gap-1.5 rounded-md')}>
            <div className="z-20 mt-[2px] rounded-md p-[2px] group-hover:bg-slate-200">
              <BsFillCaretRightFill
                className={cn(
                  'shrink-0 transform text-base transition-all duration-300 ease-in-out',
                  {
                    'rotate-90': open,
                    'rotate-0': !open
                  }
                )}
              />
            </div>
            <div className="text-start">{props.text}</div>
          </button>
        </CollapsibleTrigger>
        {!!props.children && (
          <CollapsibleContent className="pl-2">
            <div className={'inside-toggle-container px-4 pt-[0.1px]'}>
              <div className={cn(basicBlockGap)}></div>
              {props.children}
              <div className={cn(basicBlockGap)}></div>
            </div>
          </CollapsibleContent>
        )}
        <div
          className={cn(
            'absolute top-0 left-0 z-10 mt-[8px] ml-[10px] h-[calc(100%-8px)] w-1 border-l border-slate-300',
            {
              hidden: !open
            }
          )}
        ></div>
      </Collapsible>
    </div>
  )
}
