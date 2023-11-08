'use client'

import SimpleImage from '@notion-x/src/components/SimpleImage'
import AiOutlineLoading3Quarters from '@notion-x/src/icons/AiOutlineLoading3Quarters'
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
        'flex flex-col sm:flex-row gap-4 border border-slate-200 p-4 rounded-md bg-white',
        'hover:border-sky-300 group'
      )}
    >
      {/* Featured image */}
      <div
        className={cn(
          'rounded-md w-full sm:w-[120px] min-w-[120px] max-h-[100px] overflow-hidden border-slate-100 border'
        )}
      >
        {mark?.coverUrl && (
          <SimpleImage
            src={mark.coverUrl!}
            className={cn('object-cover w-full')}
            style={{ height: '100%' }}
            imagePlaceholder={ImagePlaceholder()}
          />
        )}
        {!mark?.coverUrl && (
          <div
            className={cn(
              'flex items-center justify-center rounded-md w-full',
              'h-full p-4',
              generateGradientBgClass(mark.url)
            )}
          >
            <BsFillBookmarkHeartFill className="text-[25px] text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex gap-2 flex-col">
        <div className="text-slate-900 text-[0.95rem] group-hover:m2it-link-hover">
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
        <div className="text-slate-600 text-[0.85rem] group-hover:text-slate-800">
          {mark.description}
        </div>
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
    <AiOutlineLoading3Quarters className="text-[25px] text-slate-400 animate-spin" />
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

function generateGradientBgClass(url: string): string {
  const bgList = [
    'bg-gradient-to-r from-yellow-200 via-green-200 to-green-500',
    'bg-gradient-to-r from-violet-500 to-fuchsia-500',
    'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400',
    'bg-gradient-to-r from-sky-500 to-indigo-500',
    'bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-500',
    'bg-gradient-to-r from-green-200 to-green-500',
    'bg-gradient-to-r from-cyan-500 to-blue-500',
    'bg-gradient-to-r from-purple-500 to-pink-500',
    'bg-gradient-to-r from-yellow-200 to-yellow-500',
    'bg-gradient-to-r from-rose-300 to-rose-500',
    'bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800',
    'bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-yellow-200 via-emerald-200 to-yellow-200',
    'bg-[conic-gradient(at_bottom,_var(--tw-gradient-stops))] from-white via-sky-500 to-sky-500'
  ]
  return bgList[url.length % bgList.length]
}
