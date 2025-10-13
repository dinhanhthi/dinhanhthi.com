'use client'

import cn from 'classnames'
import dynamic from 'next/dynamic'
import * as types from 'notion-types'
import { TableOfContentsEntry } from 'notion-utils'
import React from 'react'

import { useHeadsObserver } from '@/src/hooks/useHeadsObserver'
import { generateAnchor } from '@/src/lib/helpers'
import { sectionOuterClass } from '../../lib/config'
import { Text } from './text'

type PostTocProps = {
  recordMap: types.ExtendedRecordMap
  tocs: TableOfContentsEntry[]
  inPost?: boolean // This component is used in 2 places: post-body and [postSlug]
  minNumHeadingsToShowToc?: number
  defaultOpenToc?: boolean
  labelTocTitle?: string
  className?: string
}

const Equation = dynamic(() => import('./BlockEquation'))
const Code = dynamic(() => import('./BlockCode'), { ssr: false })

export default function PostToc(props: PostTocProps) {
  const components = React.useMemo(
    () => ({
      Code,
      Equation
    }),
    []
  )

  const showToc = props.tocs.length >= (props.minNumHeadingsToShowToc || 4)

  const { activeId } = useHeadsObserver()

  if (!showToc) return null

  return (
    <nav className={cn('flex h-fit w-full flex-col gap-2', props.className)}>
      <div className="text-muted pl-1 text-base italic lg:hidden">In this post</div>
      <div
        className={cn(
          'not-prose thi-scrollbar thi-scrollbar-small grid grid-cols-2 overflow-auto p-4 text-sm lg:grid-cols-1 lg:rounded-none lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none',
          sectionOuterClass
        )}
      >
        {props.tocs.map(toc => {
          const anchor = generateAnchor(toc.id, toc.text)
          const isH2 = toc.indentLevel === 0
          const isH3 = toc.indentLevel === 1

          const block = props.recordMap?.block?.[toc.id]?.value

          return (
            <a
              key={toc.id}
              href={`#${anchor}`}
              className={cn(
                'hover:text-link border-border-muted flex break-inside-avoid items-baseline gap-2 px-2 py-1',
                {
                  'ml-2 border-l pl-2': isH3,
                  '-ml-1': isH2,
                  'hover:text-link lg:text-link': activeId === anchor && !props.inPost,
                  'hover:text-link text-muted': activeId !== anchor || props.inPost
                }
              )}
            >
              {isH2 && (
                <span
                  className={cn('text-[0.7em]', {
                    'text-link': activeId === anchor && !props.inPost,
                    'text-slate-400': activeId !== anchor || props.inPost
                  })}
                >
                  ◆
                </span>
              )}
              {isH3 && (
                <span
                  className={cn('text-[0.6em]', {
                    'text-link': activeId === anchor && !props.inPost,
                    'text-slate-400': activeId !== anchor || props.inPost
                  })}
                >
                  ○
                </span>
              )}
              {!block?.properties?.title && <span className="block">{toc.text}</span>}
              {block?.properties?.title && (
                <span className="leading-snug">
                  <Text
                    ignoreMarkup={['_', 'a', 'b', 'u', 'h']}
                    components={components}
                    value={block.properties.title}
                    block={block}
                  />
                </span>
              )}
            </a>
          )
        })}
      </div>
    </nav>
  )
}

export function SkeletonPostToc({ className }: { className?: string }) {
  return (
    <nav className={cn('flex h-fit w-full flex-col gap-2', className)}>
      <div className="pl-1 text-base italic lg:hidden">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
      </div>
      <div
        className={cn(
          'grid grid-cols-2 gap-2 p-4 text-sm lg:grid-cols-1 lg:rounded-none lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none',
          sectionOuterClass
        )}
      >
        {[...Array(6)].map((_, i) => (
          <div key={i} className={cn('flex items-baseline gap-2 px-2 py-1')}>
            <div className="h-3 w-3 animate-pulse rounded-full bg-slate-200" />
            <div
              className="h-3 animate-pulse rounded-lg bg-slate-200"
              style={{ width: `${60 + Math.random() * 40}%` }}
            />
          </div>
        ))}
      </div>
    </nav>
  )
}
