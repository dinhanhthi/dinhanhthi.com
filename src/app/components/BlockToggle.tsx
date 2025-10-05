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
  updatedBlock?: React.JSX.Element
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
              className={cn('toggle-button flex gap-1.5 w-full items-start rounded-md group')}
            >
              <div className="group-hover:bg-slate-200 rounded-md z-20 p-[2px] mt-[2px]">
                <BsFillCaretRightFill
                  className={cn(
                    ' shrink-0 text-base transform ease-in-out transition-all duration-300',
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
                <DisclosurePanel className={'px-4 pt-[0.1px] inside-toggle-container'}>
                  <div className={cn(basicBlockGap)}></div>
                  {props.children}
                  <div className={cn(basicBlockGap)}></div>
                </DisclosurePanel>
              </Transition>
            )}
            <div
              className={cn(
                'absolute h-[calc(100%-8px)] top-0 left-0 w-1 border-l ml-[10px] mt-[8px] z-10',
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
