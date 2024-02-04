'use client'

import SimpleImage from '@notion-x/src/components/SimpleImage'
import AiOutlineLoading3Quarters from '@notion-x/src/icons/AiOutlineLoading3Quarters'
import { defaultMapImageUrl } from '@notion-x/src/lib/utils'
import cn from 'classnames'
import { useEffect, useState } from 'react'

import { Tool } from '../../../interface'

type ToolItemProps = {
  tool: Tool
  className?: string
  compactMode?: boolean
}

export default function ToolItem(props: ToolItemProps) {
  const { tool, className, compactMode } = props
  const [isNew, setIsNew] = useState(false)
  const convertedIconUrl = defaultMapImageUrl(tool.iconUrl, tool.block)!

  useEffect(() => {
    const now = new Date()
    const markDate = new Date(tool.createdTime)
    const diff = now.getTime() - markDate.getTime()
    const diffInDays = diff / (1000 * 3600 * 24)

    if (diffInDays <= 7) {
      setIsNew(true)
    }
  }, [tool.createdTime])

  return (
    <a
      href={tool.url}
      target="_blank"
      className={cn(
        className,
        'p-2 bg-white rounded-lg border border-slate-150',
        'transition duration-200 ease-in-out hover:-translate-y-1'
      )}
    >
      <div className={cn('flex flex-row h-full')}>
        <div
          className={cn(
            'w-[90px] h-full rounded-l-lg relative overflow-hidden shrink-0 border-[0.5px] border-slate-100'
          )}
        >
          <div className={cn('relative w-full h-full overflow-hidden')}>
            <div
              style={{
                position: 'absolute',
                inset: '0px',
                backgroundImage: `
                  linear-gradient(#f0f0f0, #f0f0f0),
                  linear-gradient(transparent, transparent),
                  url(${convertedIconUrl})`,
                backgroundBlendMode: 'luminosity, overlay, normal',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center top',
                backgroundSize: '100% 100%',
                filter: 'blur(25px) saturate(1)',
                transform: 'var(1.5) translate3d(0, 0, 0)'
              }}
            ></div>
            <div className={cn('flex items-center justify-center p-8')}>
              <SimpleImage
                src={convertedIconUrl}
                width={60}
                className={cn('absolute inset-0 m-auto rounded-md h-auto')}
                imagePlaceholder={ImagePlaceholder()}
              />
            </div>
          </div>
        </div>
        <div className={cn('min-w-0 flex-1 flex flex-col gap-4 p-3 pl-4')}>
          <div className="flex gap-3 flex-col">
            <div className="text-[0.95rem] text-slate-700 leading-snug">{tool.name}</div>
            <div className={cn('flex flex-wrap gap-x-1 gap-y-2 text-[0.75rem]')}>
              {isNew && (
                <span
                  className={cn(
                    'inline bg-amber-200 text-amber-900 px-2 py-0 text-[0.75rem] rounded-md whitespace-nowrap mr-1'
                  )}
                >
                  new
                </span>
              )}
              {tool.isFree ? (
                <span className={cn('bg-emerald-100 text-emerald-800 px-2 rounded-md')}>free</span>
              ) : (
                <span className={cn('bg-rose-100 text-rose-600 px-2 rounded-md')}>paid</span>
              )}
              {!compactMode &&
                tool.tag?.map(t => (
                  <span className={cn('bg-gray-100 text-gray-600 px-2 rounded-md')} key={t}>
                    {t}
                  </span>
                ))}
            </div>
          </div>
          {!compactMode && (
            <div className={cn('text-[0.83rem] text-slate-700 break-words overflow')}>
              {tool.description}
            </div>
          )}
        </div>
      </div>
    </a>
  )
}

const ImagePlaceholder = () => (
  <div
    style={{ width: 60, height: 60 }}
    className={cn(
      'bg-gray-100 flex items-center justify-center absolute inset-0 m-auto',
      'rounded-full shadow-md animate-pulse'
    )}
  >
    <AiOutlineLoading3Quarters className="text-[25px] text-slate-400 animate-spin" />
  </div>
)
