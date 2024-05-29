'use client'

import BsPinAngleFill from '@notion-x/src/icons/BsPinAngleFill'
import cn from 'classnames'
import { useEffect, useState } from 'react'
import { BookmarkItem } from '../../../interface'
import { StarIcon } from '../../icons/StarIcon'

type BookmarkItemSimpleTemplateProps = {
  mark: BookmarkItem
  index?: number
  showIndex?: boolean
  hidePinIcon?: boolean
  hideDescription?: boolean
  hideTags?: boolean
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
    <div className="flex w-full">
      {mark.pinned && !props.hidePinIcon && (
        <div className="relative z-50">
          <div className="absolute left-2 -top-2 text-red-500">
            <BsPinAngleFill className="text-xl" />
          </div>
        </div>
      )}
      <a
        key={mark.id}
        href={mark.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'flex flex-col w-full overflow-hidden sm:flex-row gap-4 border border-slate-200 py-4 px-5 rounded-md bg-white hover:border-sky-300 group',
          { 'pr-8 relative': mark.favorite }
        )}
      >
        {mark.favorite && (
          <div
            className="absolute right-4 top-4 text-amber-400 tooltip-auto"
            data-title="My favorite"
          >
            <StarIcon className="text-xl" />
          </div>
        )}

        {/* Index */}
        {props.showIndex && (
          <div className="items-center justify-center rounded-md h-full py-2 px-4 bg-stone-100 hidden sm:flex">
            <span className={cn(textColorClasses[index % textColorClasses.length])}>
              {index + 1}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="flex gap-3 flex-col justify-start">
          <div className="flex flex-col gap-1.5">
            <div className="overflow-hidden text-ellipsis">
              {isNew && (
                <span className="align-middle inline bg-amber-200 text-amber-900 px-2 py-0 text-[0.75rem] rounded-md whitespace-nowrap mr-2">
                  new
                </span>
              )}
              <span className="m2it-link group-hover:m2it-link-hover text-[1.05rem]">
                {mark.title}
              </span>
              <span className="text-[0.8rem] italic text-slate-500 whitespace-nowrap">
                {' '}
                — {mark.url.replace(/\/$/, '')}
              </span>
            </div>
            {!!mark.tags?.length && !props.hideTags && (
              <div className="flex gap-x-2 gap-y-1 items-center flex-row w-full flex-wrap">
                {mark.tags
                  ?.filter(tag => tag !== 'favorite')
                  ?.map((tag, index) => (
                    <span
                      key={index}
                      className="text-[0.8rem] border text-slate-700 px-2 py-0.5 rounded-md whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            )}
          </div>
          {!!mark.description && !!mark.description?.length && !props.hideDescription && (
            <div className="text-slate-700 text-[0.95rem] group-hover:text-slate-900">
              {mark.description}
            </div>
          )}
        </div>
      </a>
    </div>
  )
}

type SkeletonBookmarkItemSimpleTemplateProps = {
  index?: number
  showIndex?: boolean
}

export function SkeletonBookmarkItemSimpleTemplate(props: SkeletonBookmarkItemSimpleTemplateProps) {
  return (
    <div className="flex min-h-[100px] flex-col sm:flex-row gap-4 border border-slate-200 p-4 rounded-md bg-white group">
      {/* Index */}
      {props.showIndex && props.index && (
        <div className="flex items-center justify-center rounded-md h-full py-2 px-4 bg-stone-100">
          {props.index + 1}
        </div>
      )}

      {/* Content */}
      <div className="flex gap-4 min-w-0 flex-1 flex-col justify-start">
        <div className="flex flex-row gap-2 items-center">
          <div className="w-1/2 h-3 bg-slate-200 rounded-md"></div>
          <div className="bg-slate-200 h-0.5 w-2"></div>
          <div className="w-40 bg-slate-100 rounded-md h-2"></div>
        </div>
        <div className="w-full flex flex-row gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-12 h-5 bg-slate-100 rounded-md"></div>
          ))}
        </div>
        <div className="w-full flex flex-col gap-2">
          <div className="w-4/5 h-2.5 bg-slate-100 rounded-md"></div>
          <div className="w-3/5 h-2.5 bg-slate-100 rounded-md"></div>
        </div>
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
