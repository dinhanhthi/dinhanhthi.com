'use client'

import SimpleImage from '@/src/app/components/SimpleImage'
import AiOutlineLoading3Quarters from '@/src/app/icons/AiOutlineLoading3Quarters'
import { defaultMapImageUrl } from '@/src/lib/notion/utils'
import cn from 'classnames'
import { useEffect, useState } from 'react'

import TooltipX from '@/src/app/components/tooltip-x'
import { Book, Game, Tool } from '@/src/lib/types'
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
        'group min-h-[120px] rounded-lg border border-slate-200 bg-white transition duration-200 ease-in-out hover:-translate-y-1'
      )}
    >
      <div
        className={cn('flex h-full flex-row overflow-hidden', {
          relative: tool.favorite
        })}
      >
        {tool.favorite && props.showFavoriteStar && (
          <>
            <div id={`tool-${tool.id}`} className="absolute top-3 right-3 z-50 text-amber-400">
              <StarIcon className="text-xl" />
            </div>
            <TooltipX id={`#tool-${tool.id}`}>My favorite</TooltipX>
          </>
        )}

        {!props.isSimple && (
          <div className="relative h-full w-[90px] shrink-0 overflow-hidden rounded-l-lg border-[0.5px] border-slate-100">
            <div className="relative h-full w-full overflow-hidden">
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
                  'relative z-20 h-full min-h-[122.75px] p-4': type === 'book'
                })}
              >
                <SimpleImage
                  src={convertedIconUrl}
                  width={60}
                  className={cn({
                    'absolute inset-0 z-20 m-auto h-auto rounded-md': type === 'tool'
                  })}
                  imagePlaceholder={ImagePlaceholder()}
                />
              </div>
            </div>
          </div>
        )}

        {/* title & author */}
        <div className={cn('flex min-w-0 flex-1 flex-col gap-3 px-3 py-4 pl-4')}>
          <div className="flex flex-col gap-1">
            <div
              className={cn(
                'group-hover:m2it-link-hover text-base leading-snug font-medium text-slate-700',
                {
                  'pr-3': tool.favorite && props.showFavoriteStar
                }
              )}
            >
              {/* NEW */}
              {isNew && !tool.isReading && (
                <span className="mr-1 inline rounded-md bg-amber-200 px-2 py-0 align-middle text-[0.75rem] whitespace-nowrap text-amber-900">
                  new
                </span>
              )}

              {/* is reading */}
              {tool.isReading && (
                <span className="mr-1 inline rounded-md bg-green-100 px-2 py-0 align-middle text-[0.8rem] font-normal whitespace-nowrap text-green-700">
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
              <div id={`star-${tool.id}`} className="flex flex-row items-center gap-1">
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
                    <span className="rounded-md bg-emerald-100 px-2 text-emerald-800">free</span>
                  ) : (
                    <span className="rounded-md bg-rose-100 px-2 text-rose-600">paid</span>
                  )}
                </>
              )}

              {!props.hideTags &&
                tool.tags
                  ?.filter(tag => tag !== 'favorite')
                  ?.map(t => (
                    <span className="rounded-md bg-gray-100 px-2 text-gray-600" key={t}>
                      {t}
                    </span>
                  ))}
            </div>
          )}

          {/* description */}
          {!props.hideDescription && !props.isSimple && (
            <div className="overflow text-[0.83rem] break-words text-slate-700">
              {tool.description}
            </div>
          )}
        </div>
      </div>
    </a>
  )
}

const ImagePlaceholder = () => (
  <div className="flex h-full items-center justify-center">
    <div
      style={{ width: 60, height: 60 }}
      className={cn(
        'absolute inset-0 m-auto flex items-center justify-center',
        'animate-pulse rounded-full'
      )}
    >
      <AiOutlineLoading3Quarters className="animate-spin text-[25px] text-slate-600" />
    </div>
  </div>
)

export function SkeletonToolItem() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2">
      <div className="flex h-full flex-row">
        <div className="relative h-full w-[90px] shrink-0 overflow-hidden rounded-l-lg border-[0.5px] border-slate-100">
          <div className="relative h-full w-full overflow-hidden">
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
              <div className="absolute inset-0 m-auto h-[60px] w-[60px] max-w-[60px] animate-pulse rounded-full bg-slate-200"></div>
            </div>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 animate-pulse flex-col gap-4 p-3 pl-4">
          <div className="flex flex-col gap-1.5">
            <div className="font-semibold text-slate-700">
              <div className="h-5 w-1/2 rounded-md bg-slate-100"></div>
            </div>
            <div className="flex flex-wrap gap-x-1 gap-y-2 text-[0.75rem]">
              <div className="h-3 w-8 rounded-md bg-slate-100"></div>
              <div className="h-3 w-8 rounded-md bg-slate-100"></div>
            </div>
          </div>
          <div className="overflow text-[0.83rem] break-words text-slate-700">
            <div className="h-3 w-full rounded-md bg-slate-100"></div>
            <div className="mt-1 h-3 w-4/5 rounded-md bg-slate-100"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
