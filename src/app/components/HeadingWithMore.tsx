import cn from 'classnames'
import Link from 'next/link'
import React from 'react'

import { makeSlugText } from '@/src/lib/helpers'

type HeadingWithMoreProps = {
  title: string
  href?: string
  icon?: React.ReactNode
  className?: string
}

export default function HeadingWithMore(props: HeadingWithMoreProps) {
  const { title, href, icon, className } = props
  return (
    <h2
      id={makeSlugText(title)}
      className={cn(
        className,
        'font-heading flex flex-wrap items-baseline gap-x-4 gap-y-0 text-[1.5rem] font-medium text-slate-700'
      )}
    >
      <div className="flex items-center gap-2.5">
        {!!icon && icon}
        <span>{title}</span>
      </div>
      {href && (
        <Link
          className="hover:m2it-link-hover text-[65%] font-normal text-slate-500 italic hover:text-slate-600"
          href={href}
        >
          ...more
        </Link>
      )}
    </h2>
  )
}
