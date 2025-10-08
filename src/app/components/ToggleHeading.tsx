'use client'

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import cn from 'classnames'
import React from 'react'

import BsFillCaretRightFill from '@/src/app/icons/BsFillCaretRightFill'

type BlockHeadingToggleProps = {
  className?: string
  headingElement: React.ReactElement
  anchorRight?: React.ReactElement
  children: React.ReactNode
  updatedBlock?: React.ReactElement
  headingType?: 'h1' | 'h2' | 'h3'
}

export default function BlockHeadingToggle(props: BlockHeadingToggleProps) {
  return (
    <Disclosure defaultOpen={false}>
      {({ open }) => (
        <div className="relative">
          <div className={cn('flex w-full items-start gap-1', props.className)}>
            {props.updatedBlock}
            <DisclosureButton className="z-20 rounded-md p-1 hover:bg-slate-200">
              <BsFillCaretRightFill
                className={cn('transform text-lg transition-all duration-300 ease-in-out', {
                  'rotate-90': open,
                  'rotate-0': !open
                })}
              />
            </DisclosureButton>
            {props.headingElement}
            {props.anchorRight}
          </div>
          <DisclosurePanel>
            <div className="toggle-heading-content-container pl-8">{props.children}</div>
          </DisclosurePanel>
          <div
            className={cn(
              'absolute top-0 left-0 z-10 mt-[14px] h-[calc(100%-8px)] w-0 border-l-2 border-slate-300',
              {
                hidden: !open,
                'ml-[13.5px]':
                  !props.headingType || props.headingType === 'h2' || props.headingType === 'h1',
                'ml-[12px]': props.headingType === 'h3'
              }
            )}
          ></div>
        </div>
      )}
    </Disclosure>
  )
}
