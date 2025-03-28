'use client'

import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import cn from 'classnames'
import Link from 'next/link'
import { useRef } from 'react'

import { HIDDEN_MENUS, MENUS } from '../../../data/menus'
import { MaterialSymbolsApps } from '../../icons/MaterialSymbolsApps'
import { menuItemCommonClass } from './NavTopicItem'

const dropdownItemClass = 'flex items-center p-3 whitespace-nowrap'

export default function NavTopicsDropdown() {
  const btnRef = useRef<HTMLButtonElement>(null)
  const onClickOpt = (open: boolean) => {
    if (!open) return
    if (open) btnRef.current?.click()
  }
  return (
    <>
      <Popover className="relative">
        {({ open }) => (
          <>
            <PopoverButton
              ref={btnRef}
              className={cn(
                'flex lg:hidden !outline-none group p-0',
                { '!bg-slate-700 text-white': open, 'text-opacity-90': !open },
                menuItemCommonClass,
                '!p-1.5 ml-2'
              )}
            >
              <MaterialSymbolsApps className="w-8 h-8" />
            </PopoverButton>
            <Transition
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <PopoverPanel className="absolute left-0 z-10 mt-4 w-fit shadow-xl sm:px-0 lg:max-w-3xl">
                <div className="overflow-hidden rounded-lg shadow-lg">
                  <div className="relative grid divide-y divide-slate-600 bg-nav-dark-bg px-3 py-1">
                    {MENUS.concat(HIDDEN_MENUS).map(item => (
                      <Link
                        onClick={() => onClickOpt(open)}
                        key={item.uri}
                        href={item.uri}
                        className={dropdownItemClass}
                      >
                        <div className="flex gap-2">
                          {item.icon}
                          {item.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  )
}
