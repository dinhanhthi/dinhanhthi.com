'use client'

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import cn from 'classnames'
import React from 'react'

import BsFillCaretRightFill from '@/src/app/icons/BsFillCaretRightFill'

type BlockHeadingToggleProps = {
  className?: string
  headingElement: JSX.Element
  anchorRight?: JSX.Element
  children: React.ReactNode
  updatedBlock?: React.JSX.Element
  headingType?: 'h1' | 'h2' | 'h3'
}

export default function BlockHeadingToggle(props: BlockHeadingToggleProps) {
  return (
    <Disclosure defaultOpen={false}>
      {({ open }) => (
        <div className="relative">
          <div className={cn('flex w-full items-start gap-1', props.className)}>
            {props.updatedBlock}
            <DisclosureButton className="rounded-md p-1 hover:bg-slate-200 z-20">
              <BsFillCaretRightFill
                className={cn('text-lg transform ease-in-out transition-all duration-300', {
                  'rotate-90': open,
                  'rotate-0': !open
                })}
              />
            </DisclosureButton>
            {props.headingElement}
            {props.anchorRight}
          </div>
          <DisclosurePanel>
            <div className="pl-8 toggle-heading-content-container">{props.children}</div>
          </DisclosurePanel>
          <div
            className={cn(
              'absolute h-[calc(100%-8px)] top-0 left-0 w-0 border-sky-100 border-l-2 mt-[14px] z-10',
              {
                hidden: !open,
                'ml-[12.5px]':
                  !props.headingType || props.headingType === 'h2' || props.headingType === 'h1',
                'ml-[10.8px]': props.headingType === 'h3'
              }
            )}
          ></div>
        </div>
      )}
    </Disclosure>
  )
}
