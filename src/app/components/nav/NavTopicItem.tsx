'use client'

import cn from 'classnames'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { textClass } from './Nav'

export const menuItemCommonClass =
  'px-3 py-1.5 rounded-md font-medium text-center h-full flex items-center justify-center whitespace-nowrap whitespace-nowrap'

type NavTopicItemProps = {
  uri: string
  label: string
  className?: string
}

export default function NavTopicItem(props: NavTopicItemProps) {
  const { uri, label, className } = props
  const pathname = usePathname()
  const currentRoute = pathname.split('trang/')[0]

  return (
    <Link
      className={cn(
        isActiveClass(areSameUris(uri, currentRoute)),
        menuItemCommonClass,
        'flex text-sm',
        className
      )}
      aria-current={areSameUris(uri, currentRoute) ? 'page' : undefined}
      href={uri}
      prefetch={false}
    >
      {label}
    </Link>
  )
}

export const isActiveClass = (isCurrent: boolean) =>
  cn({
    'bg-slate-800 text-white': isCurrent,
    [`${textClass}`]: !isCurrent
  })

export const areSameUris = (uri: string, currentRoute: string) => {
  return uri === currentRoute || uri === currentRoute + '/'
}
