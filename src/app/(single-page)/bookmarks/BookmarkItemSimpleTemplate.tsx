'use client'

import cn from 'classnames'
import { useEffect, useState } from 'react'
import { BookmarkItem } from '../../../interface'

type BookmarkItemSimpleTemplateProps = {
  mark: BookmarkItem
  index?: number
}

export default function BookmarkItemSimpleTemplate(props: BookmarkItemSimpleTemplateProps) {
  const { mark, index = Math.floor(Math.random() * 51) } = props
  const [isNew, setIsNew] = useState(false)

  useEffect(() => {
    const now = new Date()
    const markDate = new Date(mark.createdTime)
    const diff = now.getTime() - markDate.getTime()
    const diffInDays = diff / (1000 * 3600 * 24)

    if (diffInDays <= 7) {
      setIsNew(true)
    }
  }, [mark.createdTime])

  return (
    <a
      key={mark.id}
      href={mark.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex flex-col sm:flex-row gap-4 border border-slate-200 p-4 rounded-md bg-white hover:border-sky-300 group'
      )}
    >
      {/* Index */}
      <div
        className={cn('flex items-center justify-center rounded-md h-full py-2 px-4 bg-stone-100')}
      >
        <span className={cn(textColorClasses[index % textColorClasses.length])}>{index + 1}</span>
      </div>

      {/* Content */}
      <div className="flex gap-1.5 flex-col justify-between">
        <div>
          {isNew && (
            <span
              className={cn(
                'inline bg-amber-200 text-amber-900 px-2 py-0 text-[0.75rem] rounded-md whitespace-nowrap mr-2'
              )}
            >
              new
            </span>
          )}
          <span className="text-black group-hover:m2it-link-hover">{mark.title}</span>
          <span className="text-[0.8rem] italic text-slate-500">
            {' '}
            — {mark.url.replace(/\/$/, '')}
          </span>
        </div>
        {!!mark.tags?.length && (
          <div className="flex gap-x-2 gap-y-0.5 items-center flex-row w-full flex-wrap">
            {mark.tags.map((tag, index) => (
              <span
                key={index}
                className={cn(
                  'text-xs border text-slate-700 px-2 py-0.5 rounded-md whitespace-nowrap'
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {!!mark.description && !!mark.description?.length && (
          <div className="text-slate-600 text-[0.85rem] group-hover:text-slate-800">
            {mark.description}
          </div>
        )}
      </div>
    </a>
  )
}

export function SkeletonBookmarkItemSimpleTemplate({ index }: { index: number }) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row gap-4 border border-slate-200 p-4 rounded-md bg-white group'
      )}
    >
      {/* Index */}
      <div
        className={cn('flex items-center justify-center rounded-md h-full py-2 px-4 bg-stone-100')}
      >
        {index + 1}
      </div>

      {/* Content */}
      <div className="flex gap-2 min-w-0 flex-1 flex-col justify-between">
        <div className="flex flex-row gap-2 items-center">
          <div className="w-1/2 h-3 bg-slate-200 rounded-md"></div>
          <div className="bg-slate-200 h-0.5 w-2"></div>
          <div className="w-40 bg-slate-100 rounded-md h-2"></div>
        </div>
        <div className="w-4/5 h-2.5 bg-slate-100 rounded-md"></div>
      </div>
    </div>
  )
}

const textColorClasses = [
  'text-red-500',
  'text-blue-500',
  'text-yellow-500',
  'text-green-500',
  'text-purple-500',
  'text-pink-500',
  'text-indigo-500',
  'text-teal-500',
  'text-orange-500',
  'text-red-400',
  'text-blue-400',
  'text-yellow-400',
  'text-green-400',
  'text-purple-400',
  'text-pink-400',
  'text-indigo-400',
  'text-teal-400',
  'text-orange-400',
  'text-red-600',
  'text-blue-600',
  'text-yellow-600',
  'text-green-600',
  'text-purple-600',
  'text-pink-600',
  'text-indigo-600',
  'text-teal-600',
  'text-orange-600',
  'text-red-700',
  'text-blue-700',
  'text-yellow-700',
  'text-green-700',
  'text-purple-700',
  'text-pink-700',
  'text-indigo-700',
  'text-teal-700',
  'text-orange-700',
  'text-red-800',
  'text-blue-800',
  'text-yellow-800',
  'text-green-800',
  'text-purple-800',
  'text-pink-800',
  'text-indigo-800',
  'text-teal-800',
  'text-orange-800',
  'text-red-900',
  'text-blue-900',
  'text-yellow-900',
  'text-green-900',
  'text-purple-900',
  'text-pink-900',
  'text-indigo-900',
  'text-teal-900',
  'text-orange-900'
]
