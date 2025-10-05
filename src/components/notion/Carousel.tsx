import cn from 'classnames'
import React from 'react'
import { useSnapCarousel } from 'react-snap-carousel'

import FaChevronLeft from '@/src/components/icons/FaChevronLeft'
import FaChevronRight from '@/src/components/icons/FaChevronRight'

interface CarouselProps<T> {
  readonly items: T[]
  readonly renderItem: (props: CarouselRenderItemProps<T>) => React.ReactElement<CarouselItemProps>
}

interface CarouselRenderItemProps<T> {
  readonly item: T
  readonly isSnapPoint: boolean
  readonly index: number
}

export const Carousel = <T,>({ items, renderItem }: CarouselProps<T>) => {
  const { scrollRef, pages, activePageIndex, prev, next, goTo, snapPointIndexes } =
    useSnapCarousel()

  const arrowBtnClasses = cn(
    'absolute top-14 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-all'
  )
  const arrowClasses = cn(
    'text-2xl hover:text-3xl transition-all text-slate-400 hover:text-slate-600'
  )

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className={cn('no-scrollbar relative flex overflow-auto snap-mandatory gap-4 pb-4')}
      >
        {items.map((item, i) =>
          renderItem({
            item,
            isSnapPoint: snapPointIndexes.has(i),
            index: i
          })
        )}
      </div>

      <button
        onClick={() => prev()}
        className={cn('-left-4', arrowBtnClasses, {
          'opacity-0': activePageIndex <= 0
        })}
      >
        <FaChevronLeft className={arrowClasses} />
      </button>

      <button
        onClick={() => next()}
        className={cn('-right-4', arrowBtnClasses, {
          'opacity-0': activePageIndex === pages.length - 1
        })}
      >
        <FaChevronRight className={arrowClasses} />
      </button>

      <div aria-hidden className="flex items-center justify-center gap-2 mt-4">
        {pages.map((_, i) => (
          <button
            key={i}
            className={cn('h-2.5 rounded-full bg-slate-600 transition-all hover:opacity-60', {
              'opacity-40 w-2.5 hover:w-3.5': activePageIndex !== i,
              'w-5 opacity-70': activePageIndex === i
            })}
            onClick={() => goTo(i)}
          ></button>
        ))}
      </div>
    </div>
  )
}

interface CarouselItemProps {
  readonly isSnapPoint: boolean
  readonly children?: React.ReactNode
  readonly widthClass?: string
}

export const CarouselItem = ({ isSnapPoint, children, widthClass }: CarouselItemProps) => (
  <div
    className={cn(
      'shrink-0',
      {
        'snap-start': isSnapPoint
      },
      widthClass ?? 'w-64'
    )}
  >
    {children}
  </div>
)
