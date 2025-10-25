'use client'

import SimpleImage from '@/src/app/components/SimpleImage'
import { defaultMapImageUrl } from '@/src/lib/notion/utils'
import cn from 'classnames'
import { useEffect, useState } from 'react'

import TooltipX from '@/src/app/components/tooltip-x'
import { LoaderCircle } from 'lucide-react'
import { sectionOuterClass } from '../../../lib/config'
import { Book } from '../../../lib/types'
import { Badge } from '../../components/ui/badge'
import { StarIcon } from '../../icons/StarIcon'

type BookItemProps = {
  book: Book
  className?: string
  showStar?: boolean
  hideDescription?: boolean
  hideTags?: boolean
}

export default function BookItem(props: BookItemProps) {
  const { book, className } = props
  const [isNew, setIsNew] = useState(false)
  const convertedIconUrl = defaultMapImageUrl(book.iconUrl, book.block)!

  useEffect(() => {
    const now = new Date()
    const markDate = new Date(book.date)
    const diff = now.getTime() - markDate.getTime()
    const diffInDays = diff / (1000 * 3600 * 24)

    if (diffInDays <= 7) {
      setIsNew(true)
    }
  }, [book.date])

  return (
    <a
      href={book.url}
      target="_blank"
      className={cn(
        className,
        'group min-h-[120px] rounded-lg transition duration-200 ease-in-out hover:-translate-y-1',
        sectionOuterClass
      )}
    >
      <div className="flex h-full flex-row overflow-hidden">
        <div className="border-border-muted relative h-full w-[90px] shrink-0 overflow-hidden border-r">
          <div className="relative h-full w-full overflow-hidden">
            <div className="bg-bg-hover absolute inset-0"></div>
            <div className="relative flex h-full min-h-[122.75px] items-center justify-center p-4">
              <SimpleImage
                src={convertedIconUrl}
                width={60}
                imagePlaceholder={ImagePlaceholder()}
              />
            </div>
          </div>
        </div>

        {/* title & author */}
        <div className={cn('flex min-w-0 flex-1 flex-col gap-3 px-3 py-4 pl-4')}>
          <div className="flex flex-col gap-1">
            <div className="text-text-heading group-hover:text-link-hover text-base leading-snug font-medium">
              {/* NEW */}
              {isNew && !book.isReading && (
                <Badge variant="secondary" className="!bg-yellow-bg !text-yellow-text !border-none">
                  new
                </Badge>
              )}

              {/* is reading */}
              {book.isReading && (
                <Badge variant="secondary" className="!bg-green-bg !text-green-text !border-none">
                  reading
                </Badge>
              )}

              {/* NAME */}
              <span className="text-[0.95rem] font-medium">{book.name}</span>
            </div>
            {book.author && (
              <div className="text-muted group-hover:text-text-heading text-sm">{book.author}</div>
            )}
          </div>

          {/* star */}
          {book.star && !book.isReading && (
            <>
              <div id={`star-${book.id}`} className="flex flex-row items-center gap-1">
                {Array.from({ length: +book.star }).map((_, index) => (
                  <StarIcon key={index} className="text-amber-400 dark:text-amber-300" />
                ))}
              </div>
              <TooltipX id={`#star-${book.id}`}>My rating</TooltipX>
            </>
          )}

          {/* tags */}
          {!props.hideTags && (
            <div className="flex flex-wrap gap-x-1 gap-y-2 text-[0.75rem]">
              {book.tags
                ?.filter(tag => tag !== 'favorite')
                ?.map(t => (
                  <Badge variant="secondary" key={t}>
                    {t}
                  </Badge>
                ))}
            </div>
          )}

          {/* description */}
          {!props.hideDescription && (
            <div className="overflow text-[0.83rem] break-words text-slate-700">
              {book.description}
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
      <LoaderCircle size={25} className="animate-spin text-slate-600" />
    </div>
  </div>
)

export function SkeletonBookItem({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-lg', sectionOuterClass, className)}>
      <div className="flex h-full flex-row">
        <div className="border-border-muted relative h-full w-[90px] shrink-0 overflow-hidden rounded-l-lg border-[0.5px]">
          <div className="relative h-full w-full overflow-hidden">
            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex items-center justify-center p-8">
              <div className="bg-bg absolute inset-0 m-auto h-[60px] w-[60px] max-w-[60px] rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4 p-3 pl-4">
          <div className="flex flex-col gap-1.5">
            <div className="font-medium">
              <div className="bg-skeleton-bg h-5 w-1/2 rounded-full"></div>
            </div>
            <div className="flex flex-wrap gap-x-1 gap-y-2 text-[0.75rem]">
              <div className="bg-skeleton-bg h-3 w-8 rounded-full"></div>
              <div className="bg-skeleton-bg h-3 w-8 rounded-full"></div>
            </div>
          </div>
          <div className="overflow text-text-color text-[0.83rem] break-words">
            <div className="bg-skeleton-bg h-3 w-full rounded-full"></div>
            <div className="bg-skeleton-bg mt-1 h-3 w-4/5 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
