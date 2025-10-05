'use client'

import { useHeadsObserver } from '@/src/hooks/useHeadsObserver'
import { makeSlugText } from '@/src/lib/helpers'
import { Tag } from '@/src/lib/types'
import cn from 'classnames'
import Link from 'next/link'

type NotesTocProps = {
  tags: Tag[]
  className?: string
  hidePinnedTags?: boolean
}

export default function NotesToc(props: NotesTocProps) {
  const { activeId } = useHeadsObserver(['h2'])

  // Makre sure below is the same as the one in /notes/page/tsx
  // We cannot use export in this case!
  // const recentUpdatedNotesTitle = 'Recently updated notes'
  // const pinnedNotesTitle = 'Pinned notes'
  // const blogPostsTitle = 'Blog posts'

  return (
    <div className={props.className}>
      <div className="thi-box-code flex h-full flex-col divide-y p-4 md:border-none md:bg-transparent md:shadow-none">
        <div className="font-heading px-2 pb-1.5 text-base font-semibold text-slate-800">
          Notes by topics
        </div>
        <div
          className={cn(
            'm2it-scrollbar m2it-scrollbar-small grid grid-cols-2 overflow-auto pt-2 text-[0.8rem] md:grid-cols-1'
          )}
        >
          {/* <a
            className={cn('hover:m2it-link flex gap-2 items-center group rounded-lg py-1 px-2', {
              'text-slate-600': activeId !== makeSlugText(blogPostsTitle),
              'text-slate-900 bg-slate-200': activeId === makeSlugText(blogPostsTitle)
            })}
            key={makeSlugText(blogPostsTitle)}
            href={`#${makeSlugText(blogPostsTitle)}`}
          >
            <div className="flex items-center gap-1">{blogPostsTitle}</div>
          </a> */}
          {/* {!props.hidePinnedTags && (
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
          )} */}
          {/* <a
            className={cn('hover:m2it-link flex gap-2 items-center group rounded-lg py-1 px-2', {
              'text-slate-600': activeId !== makeSlugText(recentUpdatedNotesTitle),
              'text-slate-900 bg-slate-200': activeId === makeSlugText(recentUpdatedNotesTitle)
            })}
            key={makeSlugText(recentUpdatedNotesTitle)}
            href={`#${makeSlugText(recentUpdatedNotesTitle)}`}
          >
            <div>{recentUpdatedNotesTitle}</div>
          </a> */}
          {props.tags.map((tag: Tag) => {
            const anchor = makeSlugText(tag.name)
            return (
              <a
                className={cn(
                  'hover:m2it-link group flex items-center gap-2 rounded-lg px-2 py-1',
                  {
                    'text-slate-600': activeId !== anchor,
                    'bg-slate-200 text-slate-900': activeId === anchor
                  }
                )}
                key={anchor}
                href={`#${anchor}`}
              >
                <div>{tag.name}</div>
              </a>
            )
          })}
          <Link className="hover:m2it-link pt-2 text-[0.9rem] text-slate-700 italic" href="/tags/">
            👉 See all topics...
          </Link>
        </div>
      </div>
    </div>
  )
}
