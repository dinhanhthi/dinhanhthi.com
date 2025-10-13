'use client'

import { useHeadsObserver } from '@/src/hooks/useHeadsObserver'
import { makeSlugText } from '@/src/lib/helpers'
import { Tag } from '@/src/lib/types'
import cn from 'classnames'
import Link from 'next/link'
import { sectionOuterClass } from '../../lib/config'

type NotesTocProps = {
  tags: Tag[]
  className?: string
  hidePinnedTags?: boolean
}

export default function NotesToc(props: NotesTocProps) {
  const { activeId } = useHeadsObserver(['h2'])

  const anchorA = (anchor?: string, name?: string, activeId?: string) => {
    return (
      <a
        className={cn('group hover:text-link flex items-center gap-1 px-2 py-1', {
          'border-transparent text-slate-600': activeId !== anchor,
          'text-link': activeId === anchor
        })}
        key={anchor}
        href={`#${anchor}`}
      >
        <span
          className={cn({
            'text-transparent': activeId !== anchor,
            'text-link': activeId === anchor
          })}
        >
          ◆
        </span>
        <span className="whitespace-nowrap">{name}</span>
      </a>
    )
  }

  return (
    <div className={cn('flex flex-col gap-1', props.className)}>
      <div className="text-muted pl-1 text-base italic md:hidden">In this page</div>
      <div
        className={cn(
          'flex h-full flex-col divide-y divide-slate-300 p-2 md:border-none md:bg-transparent md:p-0 md:shadow-none',
          sectionOuterClass
        )}
      >
        <div
          className={cn(
            'm2it-scrollbar m2it-scrollbar-small grid grid-cols-2 overflow-auto pt-2 text-sm md:grid-cols-1'
          )}
        >
          {anchorA('blog-posts', 'Blog posts', activeId)}
          {anchorA('pinned-notes', 'Pinned notes', activeId)}
          {anchorA('recently-updated-notes', 'Recently updated', activeId)}
          {props.tags.map((tag: Tag) => {
            const anchor = makeSlugText(tag.name)
            return anchorA(anchor, tag.name, activeId)
          })}
          <Link
            className="group flex items-center gap-1 px-2 py-1 text-slate-600 hover:text-sky-600"
            href="/tags/"
          >
            <span className="text-transparent">◆</span>
            ...
          </Link>
        </div>
      </div>
    </div>
  )
}
