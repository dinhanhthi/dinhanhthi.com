'use client'

import BsPinAngleFill from '@notion-x/src/icons/BsPinAngleFill'
import { Tag } from '@notion-x/src/interface'
import { makeSlugText } from '@notion-x/src/lib/helpers'
import { useHeadsObserver } from '@notion-x/src/lib/hooks'
import cn from 'classnames'
import Link from 'next/link'

type NotesTocProps = {
  tags: Tag[]
  className?: string
}

export default function NotesToc(props: NotesTocProps) {
  const { activeId } = useHeadsObserver(['h2'])

  // Makre sure below is the same as the one in /notes/page/tsx
  // We cannot use export in this case!
  const recentUpdatedNotesTitle = 'Recently updated notes'
  const pinnedNotesTitle = 'Pinned notes'

  return (
    <div className={props.className}>
      <div
        className={cn(
          'p-4 flex flex-col divide-y thi-box-code md:bg-transparent md:border-none md:shadow-none'
        )}
      >
        <div className="pb-2 font-heading font-semibold text-slate-800">Notes by topics</div>
        <div
          className={cn(
            'grid grid-cols-2 gap-1 md:grid-cols-1 pt-3 overflow-auto m2it-scrollbar m2it-scrollbar-small',
            'text-[0.9rem]'
          )}
        >
          <a
            className={cn('hover:m2it-link flex gap-2 items-center group', {
              'text-slate-600': activeId !== makeSlugText(pinnedNotesTitle),
              'text-slate-900 font-semibold hover:font-semibold':
                activeId === makeSlugText(pinnedNotesTitle)
            })}
            key={makeSlugText(pinnedNotesTitle)}
            href={`#${makeSlugText(pinnedNotesTitle)}`}
          >
            <div className="flex items-center gap-1">
              <BsPinAngleFill className="text-sm" />
              {pinnedNotesTitle}
            </div>
          </a>
          <a
            className={cn('hover:m2it-link flex gap-2 items-center group', {
              'text-slate-600': activeId !== makeSlugText(recentUpdatedNotesTitle),
              'text-slate-900 font-semibold hover:font-semibold':
                activeId === makeSlugText(recentUpdatedNotesTitle)
            })}
            key={makeSlugText(recentUpdatedNotesTitle)}
            href={`#${makeSlugText(recentUpdatedNotesTitle)}`}
          >
            <div>{recentUpdatedNotesTitle}</div>
          </a>
          {props.tags.map((tag: Tag) => {
            const anchor = makeSlugText(tag.name)
            return (
              <a
                className={cn('hover:m2it-link flex gap-2 items-center group', {
                  'text-slate-600': activeId !== anchor,
                  'text-slate-900 font-semibold hover:font-semibold': activeId === anchor
                })}
                key={anchor}
                href={`#${anchor}`}
              >
                <div>{tag.name}</div>
              </a>
            )
          })}
          <Link className="italic text-[0.9rem] pt-2 text-slate-700 hover:m2it-link" href="/tags/">
            👉 See all topics...
          </Link>
        </div>
      </div>
    </div>
  )
}
