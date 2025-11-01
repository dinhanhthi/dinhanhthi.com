import cn from 'classnames'
import Link from 'next/link'
import { HIDDEN_MENUS } from '../../../data/menus'
import { ThreeDotsIcon } from '../../icons/ThreeDotsIcon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { buttonClass } from './Nav'
import { menuItemCommonClass } from './NavTopicItem'

type NavHiddenProps = {
  className?: string
}

export default function NavHidden(props: NavHiddenProps) {
  return (
    <>
      {HIDDEN_MENUS.length > 0 && (
        <div className={props.className}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(buttonClass, menuItemCommonClass, '!px-1.5')}>
                <ThreeDotsIcon className="text-2xl" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-nav-dark-bg z-[1000] grid divide-y divide-slate-600 rounded-md border-[0.5px] border-slate-600 p-0"
            >
              {HIDDEN_MENUS.map(item => (
                <DropdownMenuItem key={item.uri} asChild>
                  <Link
                    href={item.uri}
                    className={cn('flex items-center whitespace-nowrap', buttonClass)}
                  >
                    <div className="flex gap-2 px-4 py-3">
                      {item.icon}
                      {item.name}
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  )
}
