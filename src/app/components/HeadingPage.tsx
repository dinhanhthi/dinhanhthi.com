import cn from 'classnames'
import Link from 'next/link'
import React from 'react'

import { makeSlugText } from '@/src/lib/helpers'

type HeadingPageProps = {
  title: string
  href?: string
  icon?: React.ReactNode
  className?: string
}

export default function HeadingPage(props: HeadingPageProps) {
  const { title, href, icon, className } = props
  return (
    <div className="flex items-center gap-2">
      {!!icon && icon}
      <h2
        id={makeSlugText(title)}
        className={cn(
          className,
          'font-heading text-text-heading flex scroll-mt-[70px] flex-wrap items-baseline gap-x-4 gap-y-0 text-[1.5rem] font-medium'
        )}
      >
        {title}
        {href && (
          <Link
            className="text-muted hover:text-link font-sans text-sm font-normal italic"
            href={href}
          >
            ...more
          </Link>
        )}
      </h2>
    </div>
  )
}

export function SkeletonHeadingPage({
  className,
  hasIcon = false
}: {
  className?: string
  hasIcon?: boolean
}) {
  return (
    <div className={cn('flex animate-pulse items-center gap-2', className)}>
      {hasIcon && <div className="bg-skeleton-bg h-[30px] w-[30px] rounded-full"></div>}
      <div className="bg-skeleton-bg h-[26px] w-[250px] rounded-full"></div>
    </div>
  )
}
