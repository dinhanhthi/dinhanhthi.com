'use client'

import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react'
import cn from 'classnames'
import React from 'react'

import { basicBlockGap, blockMargin } from '@/src/app/components/block'
import BsFillCaretRightFill from '@/src/app/icons/BsFillCaretRightFill'
import { mapColorClass } from '@/src/lib/helpers'

export default function BlockToggle(props: {
  text: React.ReactNode
  color?: string
  children?: React.ReactNode
  className?: string
  updatedBlock?: React.ReactElement
}) {
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
      <Disclosure defaultOpen={false}>
        {({ open }) => (
          <>
            <DisclosureButton
              className={cn('toggle-button group flex w-full items-start gap-1.5 rounded-md')}
            >
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
            </DisclosureButton>
            {!!props.children && (
              <Transition
                as="div"
                enter="transition duration-200 ease-in-out"
                enterFrom="transform scale-y-95 opacity-0"
                enterTo="transform scale-y-100 opacity-100"
                leave="transition duration-200 ease-in-out"
                leaveFrom="transform scale-y-100 opacity-100"
                leaveTo="transform scale-y-95 opacity-0"
                className={'pl-2'}
              >
                <DisclosurePanel className={'inside-toggle-container px-4 pt-[0.1px]'}>
                  <div className={cn(basicBlockGap)}></div>
                  {props.children}
                  <div className={cn(basicBlockGap)}></div>
                </DisclosurePanel>
              </Transition>
            )}
            <div
              className={cn(
                'absolute top-0 left-0 z-10 mt-[8px] ml-[10px] h-[calc(100%-8px)] w-1 border-l border-slate-300',
                {
                  hidden: !open
                }
              )}
            ></div>
          </>
        )}
      </Disclosure>
    </div>
  )
}
