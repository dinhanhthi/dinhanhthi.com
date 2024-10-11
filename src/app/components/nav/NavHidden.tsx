import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import cn from 'classnames'
import Link from 'next/link'
import { HIDDEN_MENUS } from '../../../data/menus'
import { ThreeDotsIcon } from '../../icons/ThreeDotsIcon'
import { textClass } from './Nav'
import { menuItemCommonClass } from './NavTopicItem'

type NavHiddenProps = {
  className?: string
}

export default function NavHidden(props: NavHiddenProps) {
  return (
    <div className={props.className}>
      <Menu>
        <MenuButton className={cn(textClass, menuItemCommonClass, '!px-1.5')}>
          <ThreeDotsIcon className="text-2xl" />
        </MenuButton>
        <Transition
          enter="transition ease-out duration-75"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <MenuItems
            anchor="bottom end"
            className="relative grid divide-y divide-slate-600 bg-nav-dark-bg z-[1000] border-[0.5px] border-slate-600 rounded-md"
          >
            {HIDDEN_MENUS.map(item => (
              <MenuItem key={item.uri}>
                <Link
                  href={item.uri}
                  className={cn('flex items-center whitespace-nowrap', textClass)}
                >
                  <div className="flex gap-2 px-4 py-3">
                    {item.icon}
                    {item.name}
                  </div>
                </Link>
              </MenuItem>
            ))}
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  )
}
