'use client'

import cn from 'classnames'
import dynamic from 'next/dynamic'
import * as types from 'notion-types'
import { TableOfContentsEntry } from 'notion-utils'
import React, { useState } from 'react'

import IoIosArrowDown from '@/src/components/icons/IoIosArrowDown'
import { generateAnchor } from '@/src/lib/helpers'
import { useHeadsObserver } from '@/src/lib/notion/hooks'
import { Text } from './text'

type PostTocProps = {
  recordMap: types.ExtendedRecordMap
  tocs: TableOfContentsEntry[]
  inPost?: boolean // This component is used in 2 places: post-body and [postSlug]
  minNumHeadingsToShowToc?: number
  defaultOpenToc?: boolean
  labelTocTitle?: string
  postTocClassName?: string
}

const Equation = dynamic(() => import('./BlockEquation'))
const Code = dynamic(() => import('./BlockCode'), { ssr: false })

/**
 * IMPORTANT: Add class "scroll-mt-[70px]" to the heading elements!
 */

export default function PostToc(props: PostTocProps) {
  const [showContent, setShowContent] = useState(props.defaultOpenToc || false)
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
    <nav
      className={cn(
        'h-fit w-full flex gap-2 flex-col px-2 py-3 bg-slate-50 rounded-xl m2it-box-shadow',
        {
          '2xl:hidden': props.inPost, // hide on large screens
          'max-h-full p-3': !props.inPost,
          'border-[0.5px]': !props.inPost,
          'max-h-[350px] mb-10': props.inPost,
          border: props.inPost
        },
        props.postTocClassName
      )}
      aria-label="Table of contents"
    >
      <button
        className={cn('text-slate-700 flex items-center justify-between font-semibold pb-0 px-2')}
        onClick={() => setShowContent(!showContent)}
      >
        <div className={cn('text-[0.95em]')}>{props.labelTocTitle || 'In this post'}</div>
        <div>
          <IoIosArrowDown
            className={cn('text-xl ease-in-out transition-all duration-300', {
              'rotate-0': showContent,
              'rotate-[-90deg]': !showContent
            })}
          />
        </div>
      </button>
      {showContent && (
        <div
          className={cn(
            'not-prose pt-3 pl-1 overflow-auto m2it-scrollbar m2it-scrollbar-small border-t',
            {
              'columns-1 md:columns-2': props.inPost
            }
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
                  'flex items-baseline gap-2 hover:m2it-link text-[0.88em] py-1 px-2 break-inside-avoid',
                  {
                    'border-l pl-2 ml-2': isH3,
                    '-ml-1': isH2,
                    'bg-slate-200 text-black hover:m2it-link-hover': activeId === anchor && !props.inPost,
                    'text-slate-700 hover:m2it-link-hover': activeId !== anchor || props.inPost
                  }
                )}
              >
                {isH2 && <span className="text-[0.7em] text-slate-400">◆</span>}
                {isH3 && <span className="text-[0.6em] text-slate-400">○</span>}
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
      )}
    </nav>
  )
}
