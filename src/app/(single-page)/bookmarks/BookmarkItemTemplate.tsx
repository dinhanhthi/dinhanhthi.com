'use client'

import SimpleImage from '@notion-x/src/components/SimpleImage'
import cn from 'classnames'
import { useEffect, useState } from 'react'

import { BookmarkItem } from '../../../interface'
import BsFillBookmarkHeartFill from '../../icons/BsFillBookmarkHeartFill'

export default function BookmarkItemTemplate({ mark }: { mark: BookmarkItem }) {
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
        'flex flex-row gap-4 border border-slate-200 p-4 rounded-md bg-white',
        'hover:border-sky-300 group'
      )}
    >
      {/* Featured image */}
      <div
        className={cn('rounded-md w-[120px] min-w-[120px] overflow-hidden border-slate-100 border')}
      >
        {mark?.coverUrl && (
          <SimpleImage
            src={mark.coverUrl!}
            width={120}
            className={cn('object-cover')}
            style={{ height: '100%' }}
            imagePlaceholder={ImagePlaceholder()}
          />
        )}
        {!mark?.coverUrl && (
          <div className={cn('p-4', 'flex items-center justify-center bg-slate-100')}>
            <BsFillBookmarkHeartFill className="text-2xl text-slate-300" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex gap-2 flex-col">
        <div className="text-slate-900 text-[0.9rem] group-hover:m2it-link-hover">
          {isNew && (
            <span
              className={cn(
                'inline bg-amber-200 text-amber-900 px-2 py-0 text-[0.75rem] rounded-md',
                'whitespace-nowrap mr-2'
              )}
            >
              new
            </span>
          )}
          {mark.title}
        </div>
        <div className="text-slate-600 text-[0.8rem]">{mark.description}</div>
      </div>
    </a>
  )
}

const ImagePlaceholder = () => (
  <div
    style={{ width: 120 }}
    className={cn(
      'bg-gray-100 flex items-center justify-center animate-pulse rounded-md w-[120px] min-w-[120px]',
      'h-full'
    )}
  >
    <BsFillBookmarkHeartFill className="text-[25px] text-slate-400" />
  </div>
)

export function SkeletonBookmarkItemTemplate() {
  return (
    <div className="flex flex-row gap-4 border border-slate-200 p-4 rounded-md bg-white">
      {/* Featured image */}
      <div
        className={cn('rounded-md w-[120px] min-w-[120px] overflow-hidden border-slate-100 border')}
      >
        <div className={cn('p-4', 'flex items-center justify-center bg-slate-100')}>
          <BsFillBookmarkHeartFill className="text-2xl text-slate-300" />
        </div>
      </div>

      {/* Content */}
      <div className={cn('min-w-0 flex-1 flex flex-col gap-4 pl-4 animate-pulse')}>
        <div className="flex gap-1.5 flex-col">
          <div className="font-semibold text-slate-700">
            <div className="w-1/2 h-4 bg-slate-100 rounded-md"></div>
          </div>
        </div>
        <div className={cn('flex flex-col gap-1 text-slate-700')}>
          <div className="w-full h-2 bg-slate-100 rounded-md"></div>
          <div className="w-4/5 h-2 bg-slate-100 rounded-md"></div>
        </div>
      </div>
    </div>
  )
}
