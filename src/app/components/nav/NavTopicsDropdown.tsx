'use client'

import cn from 'classnames'
import Link from 'next/link'
import { useState } from 'react'

import { HIDDEN_MENUS, MENUS } from '../../../data/menus'
import { MaterialSymbolsApps } from '../../icons/MaterialSymbolsApps'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { menuItemCommonClass } from './NavTopicItem'

const dropdownItemClass = 'flex items-center p-3 whitespace-nowrap'

export default function NavTopicsDropdown() {
  const [open, setOpen] = useState(false)
  const onClickOpt = () => {
    setOpen(false)
  }
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'group flex p-0 !outline-none lg:hidden',
              { '!bg-slate-700 text-white': open, 'text-opacity-90': !open },
              menuItemCommonClass,
              'ml-2 !p-1.5'
            )}
          >
            <MaterialSymbolsApps className="h-8 w-8" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-fit p-0 shadow-xl" sideOffset={16}>
          <div className="overflow-hidden rounded-lg shadow-lg">
            <div className="bg-nav-dark-bg relative grid divide-y divide-slate-600 px-3 py-1">
              {MENUS.concat(HIDDEN_MENUS).map(item => (
                <Link
                  onClick={onClickOpt}
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
        </PopoverContent>
      </Popover>
    </>
  )
}
