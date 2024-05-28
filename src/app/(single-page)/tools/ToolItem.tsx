'use client'

import SimpleImage from '@notion-x/src/components/SimpleImage'
import AiOutlineLoading3Quarters from '@notion-x/src/icons/AiOutlineLoading3Quarters'
import { defaultMapImageUrl } from '@notion-x/src/lib/utils'
import cn from 'classnames'
import { useEffect, useState } from 'react'

import { Book, Tool } from '../../../interface'
import { StarIcon } from '../../icons/StarIcon'

type ToolItemProps = {
  type?: 'tool' | 'book'
  tool: Tool & Book
  className?: string
  showStar?: boolean
  hideDescription?: boolean
  hideTags?: boolean
}

export default function ToolItem(props: ToolItemProps) {
  const { type = 'tool', tool, className } = props
  const [isNew, setIsNew] = useState(false)
  const convertedIconUrl = defaultMapImageUrl(tool.iconUrl || tool.coverUrl, tool.block)!

  useEffect(() => {
    const now = new Date()
    const markDate = new Date(tool.readDate || tool.createdTime)
    const diff = now.getTime() - markDate.getTime()
    const diffInDays = diff / (1000 * 3600 * 24)

    if (diffInDays <= 7) {
      setIsNew(true)
    }
  }, [tool.createdTime, tool.readDate])

  return (
    <a
      href={tool.url || tool.goodreads}
      target="_blank"
      className={cn(
        className,
        'p-2 bg-white rounded-lg border border-slate-150 transition duration-200 ease-in-out hover:-translate-y-1 group'
      )}
    >
      <div
        className={cn('flex flex-row h-full', {
          relative: tool.favorite
        })}
      >
        {/* {tool.favorite && (
          <div
            className="absolute left-0 top-0 text-amber-400 tooltip-auto z-50"
            data-title="My favorite"
          >
            <StarIcon className="text-xl" />
          </div>
        )} */}

        <div className="w-[90px] h-full rounded-l-lg relative overflow-hidden shrink-0 border-[0.5px] border-slate-100">
          <div className="relative w-full h-full overflow-hidden">
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
                transform: 'var(1.5) translate3d(0, 0, 0)',
                zIndex: 10
              }}
            ></div>
            <div
              className={cn('flex items-center justify-center', {
                'p-8': type === 'tool',
                'p-4 relative z-20 min-h-[122.75px] h-full': type === 'book'
              })}
            >
              <SimpleImage
                src={convertedIconUrl}
                width={60}
                className={cn({
                  'absolute inset-0 m-auto rounded-md h-auto z-20': type === 'tool'
                })}
                imagePlaceholder={ImagePlaceholder()}
              />
            </div>
          </div>
        </div>
        <div className={cn('min-w-0 flex-1 flex flex-col gap-4 p-3 pl-4')}>
          <div className="flex gap-3 flex-col">
            <div className="flex flex-col gap-2">
              <div className="text-base text-slate-700 font-medium group-hover:m2it-link-hover leading-snug">
                {isNew && (
                  <span className="align-middle inline bg-amber-200 text-amber-900 px-2 py-0 text-[0.75rem] rounded-md whitespace-nowrap mr-1">
                    new
                  </span>
                )}
                {tool.name || tool.title}
              </div>
              {tool.author && <div className="text-sm text-slate-600">{tool.author}</div>}

              {tool.star && !tool.isReading && (
                <div
                  className="flex flex-row gap-1 items-center tooltip-auto"
                  data-title="My rating"
                >
                  {Array.from({ length: +tool.star }).map((_, index) => (
                    <StarIcon key={index} className="text-amber-400" />
                  ))}
                </div>
              )}

              {tool.isReading && (
                <div className="flex flex-row gap-1 items-center">
                  <div className="text-sm text-green-700 italic">I{"'"}m reading...</div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-x-1 gap-y-2 text-[0.75rem]">
              {typeof tool.isFree !== 'undefined' && (
                <>
                  {tool.isFree ? (
                    <span className="bg-emerald-100 text-emerald-800 px-2 rounded-md">free</span>
                  ) : (
                    <span className="bg-rose-100 text-rose-600 px-2 rounded-md">paid</span>
                  )}
                </>
              )}

              {!props.hideTags &&
                tool.tag
                  ?.filter(tag => tag !== 'favorite')
                  ?.map(t => (
                    <span className="bg-gray-100 text-gray-600 px-2 rounded-md" key={t}>
                      {t}
                    </span>
                  ))}
            </div>
          </div>
          {!props.hideDescription && (
            <div className="text-[0.83rem] text-slate-700 break-words overflow">
              {tool.description}
            </div>
          )}
        </div>
      </div>
    </a>
  )
}

const ImagePlaceholder = () => (
  <div className="flex items-center justify-center h-full">
    <div
      style={{ width: 60, height: 60 }}
      className={cn(
        'flex items-center justify-center absolute inset-0 m-auto',
        'rounded-full animate-pulse'
      )}
    >
      <AiOutlineLoading3Quarters className="text-[25px] text-slate-600 animate-spin" />
    </div>
  </div>
)
