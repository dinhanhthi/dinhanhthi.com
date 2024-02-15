'use client'

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
  const blogPostsTitle = 'Blog posts'

  return (
    <div className={props.className}>
      <div
        className={cn(
          'p-4 flex flex-col divide-y thi-box-code md:bg-transparent md:border-none md:shadow-none'
        )}
      >
        <div className="pb-1.5 px-2 font-heading text-lg font-semibold text-slate-800">
          Notes by topics
        </div>
        <div
          className={cn(
            'grid grid-cols-2 md:grid-cols-1 pt-2 overflow-auto m2it-scrollbar m2it-scrollbar-small text-[0.88rem]'
          )}
        >
          <a
            className={cn('hover:m2it-link flex gap-2 items-center group rounded-lg py-1 px-2', {
              'text-slate-600': activeId !== makeSlugText(blogPostsTitle),
              'text-slate-900 bg-slate-200': activeId === makeSlugText(blogPostsTitle)
            })}
            key={makeSlugText(blogPostsTitle)}
            href={`#${makeSlugText(blogPostsTitle)}`}
          >
            <div className="flex items-center gap-1">{blogPostsTitle}</div>
          </a>
          <a
            className={cn('hover:m2it-link flex gap-2 items-center group rounded-lg py-1 px-2', {
              'text-slate-600': activeId !== makeSlugText(pinnedNotesTitle),
              'text-slate-900 bg-slate-200': activeId === makeSlugText(pinnedNotesTitle)
            })}
            key={makeSlugText(pinnedNotesTitle)}
            href={`#${makeSlugText(pinnedNotesTitle)}`}
          >
            <div className="flex items-center gap-1">{pinnedNotesTitle}</div>
          </a>
          <a
            className={cn('hover:m2it-link flex gap-2 items-center group rounded-lg py-1 px-2', {
              'text-slate-600': activeId !== makeSlugText(recentUpdatedNotesTitle),
              'text-slate-900 bg-slate-200': activeId === makeSlugText(recentUpdatedNotesTitle)
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
                className={cn(
                  'hover:m2it-link flex gap-2 items-center group rounded-lg py-1 px-2',
                  {
                    'text-slate-600': activeId !== anchor,
                    'text-slate-900 bg-slate-200': activeId === anchor
                  }
                )}
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
