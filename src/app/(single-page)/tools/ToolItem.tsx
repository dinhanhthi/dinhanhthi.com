'use client'

import SimpleImage from '@/src/components/notion/SimpleImage'
import AiOutlineLoading3Quarters from '@/src/components/icons/AiOutlineLoading3Quarters'
import { defaultMapImageUrl } from '@/src/lib/notion/utils'
import cn from 'classnames'
import { useEffect, useState } from 'react'

import TooltipX from '@/src/components/notion/tooltip-x'
import { Book, Game, Tool } from '../../../interface'
import { StarIcon } from '../../icons/StarIcon'

export type ToolItemInputType = Tool & Book & Game

type ToolItemProps = {
  type?: 'tool' | 'book'
  tool: ToolItemInputType
  className?: string
  showStar?: boolean
  hideDescription?: boolean
  hideTags?: boolean
  showFavoriteStar?: boolean
  isSimple?: boolean // hide image, description, tags
}

export default function ToolItem(props: ToolItemProps) {
  const { type = 'tool', tool, className } = props
  const [isNew, setIsNew] = useState(false)
  const convertedIconUrl = defaultMapImageUrl(tool.iconUrl, tool.block)!

  useEffect(() => {
    const now = new Date()
    const markDate = new Date(tool.date)
    const diff = now.getTime() - markDate.getTime()
    const diffInDays = diff / (1000 * 3600 * 24)

    if (diffInDays <= 7) {
      setIsNew(true)
    }
  }, [tool.date])

  return (
    <a
      href={tool.url}
      target="_blank"
      className={cn(
        className,
        'bg-white rounded-lg border border-slate-150 transition duration-200 ease-in-out hover:-translate-y-1 group min-h-[120px]'
      )}
    >
      <div
        className={cn('flex flex-row h-full overflow-hidden', {
          relative: tool.favorite
        })}
      >
        {tool.favorite && props.showFavoriteStar && (
          <>
            <div id={`tool-${tool.id}`} className="absolute right-3 top-3 text-amber-400 z-50">
              <StarIcon className="text-xl" />
            </div>
            <TooltipX id={`#tool-${tool.id}`}>My favorite</TooltipX>
          </>
        )}

        {!props.isSimple && (
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
        )}

        {/* title & author */}
        <div className={cn('min-w-0 flex-1 flex flex-col gap-3 px-3 py-4 pl-4')}>
          <div className="flex flex-col gap-1">
            <div
              className={cn(
                'text-base text-slate-700 font-medium group-hover:m2it-link-hover leading-snug',
                {
                  'pr-3': tool.favorite && props.showFavoriteStar
                }
              )}
            >
              {/* NEW */}
              {isNew && !tool.isReading && (
                <span className="align-middle inline bg-amber-200 text-amber-900 px-2 py-0 text-[0.75rem] rounded-md whitespace-nowrap mr-1">
                  new
                </span>
              )}

              {/* is reading */}
              {tool.isReading && (
                <span className="align-middle inline bg-green-100 font-normal text-green-700 px-2 py-0 text-[0.8rem] rounded-md whitespace-nowrap mr-1">
                  reading
                </span>
              )}

              {/* NAME */}
              <span className="text-[0.95rem] font-medium">{tool.name}</span>
            </div>
            {tool.author && (
              <div className="text-sm text-slate-500 group-hover:text-slate-700">{tool.author}</div>
            )}
          </div>

          {/* star */}
          {tool.star && !tool.isReading && (
            <>
              <div id={`star-${tool.id}`} className="flex flex-row gap-1 items-center">
                {Array.from({ length: +tool.star }).map((_, index) => (
                  <StarIcon key={index} className="text-amber-400" />
                ))}
              </div>
              <TooltipX id={`#star-${tool.id}`}>My rating</TooltipX>
            </>
          )}

          {/* tags */}
          {!props.isSimple && (
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
                tool.tags
                  ?.filter(tag => tag !== 'favorite')
                  ?.map(t => (
                    <span className="bg-gray-100 text-gray-600 px-2 rounded-md" key={t}>
                      {t}
                    </span>
                  ))}
            </div>
          )}

          {/* description */}
          {!props.hideDescription && !props.isSimple && (
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

export function SkeletonToolItem() {
  return (
    <div className="p-2 bg-white rounded-lg border border-slate-150">
      <div className="flex flex-row h-full">
        <div className="w-[90px] h-full rounded-l-lg relative overflow-hidden shrink-0 border-[0.5px] border-slate-100">
          <div className="relative w-full h-full overflow-hidden">
            <div
              style={{
                position: 'absolute',
                inset: '0px',
                backgroundImage: `
                  linear-gradient(#f0f0f0, #f0f0f0),
                  linear-gradient(transparent, transparent),
                  url()`,
                backgroundBlendMode: 'luminosity, overlay, normal',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center top',
                backgroundSize: '100% 100%',
                filter: 'blur(25px) saturate(1)',
                transform: 'var(1.5) translate3d(0, 0, 0)'
              }}
            ></div>
            <div className="flex items-center justify-center p-8">
              <div className="animate-pulse w-[60px] h-[60px] max-w-[60px] absolute inset-0 m-auto rounded-full bg-slate-200"></div>
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1 flex flex-col gap-4 p-3 pl-4 animate-pulse">
          <div className="flex gap-1.5 flex-col">
            <div className="font-semibold text-slate-700">
              <div className="w-1/2 h-5 bg-slate-100 rounded-md"></div>
            </div>
            <div className="flex flex-wrap gap-x-1 gap-y-2 text-[0.75rem]">
              <div className="w-8 h-3 bg-slate-100 rounded-md"></div>
              <div className="w-8 h-3 bg-slate-100 rounded-md"></div>
            </div>
          </div>
          <div className="text-[0.83rem] text-slate-700 break-words overflow">
            <div className="w-full h-3 bg-slate-100 rounded-md"></div>
            <div className="w-4/5 h-3 bg-slate-100 rounded-md mt-1"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
