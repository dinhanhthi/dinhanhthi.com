import cn from 'classnames'
import Link from 'next/link'

import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationProps = {
  path: string
  total: number
  current: number
  className?: string
  pageAlias?: string
}

export default function Pagination(props: PaginationProps) {
  const { path, total, current, className, pageAlias } = props

  const hClass = 'h-9'
  const wClass = 'w-9'
  const sizeCurrentClass = 'h-12 w-12'
  const classNumber = `${hClass} ${wClass} hidden cursor-pointer items-center
    justify-center rounded-full leading-5 transition duration-150 ease-in !flex`
  const classCurrent = `${sizeCurrentClass} rounded-full text-white shadow-md
    items-center justify-center leading-5 transition duration-150 ease-in !flex`
  const classSeparated = `h-10 w-10 flex cursor-pointer items-center
    justify-center rounded-full bg-bg-hover hover:shadow-md`
  const classArrow = classSeparated + ' opacity-80 hover:opacity-100'
  return (
    <div className={cn('my-12 flex flex-col items-center', className)}>
      <div className="text-text flex items-center">
        {/* Arrows left */}
        {current > 1 && (
          <Link href={getPagePath(current - 1, path, pageAlias)}>
            <div className={cn(classArrow, 'mr-2')}>
              <ChevronLeft size={24} />
            </div>
          </Link>
        )}

        {/* 1 */}
        {current > 4 && (
          <Link href={getPagePath(1, path, pageAlias)}>
            <div className={cn(classSeparated, 'mr-2')}>1</div>
          </Link>
        )}

        <div className="relative flex items-center">
          <div
            className={`absolute -z-10 flex ${hClass} bg-bg-hover w-full rounded-full font-medium shadow-md`}
          ></div>

          {/* 1 but next is 2, so we put inside the middle bar */}
          {current === 4 && (
            <Link href={getPagePath(1, path, pageAlias)}>
              <div className={cn(classNumber, 'ml-2')}>1</div>
            </Link>
          )}

          {current > 2 && (
            <Link href={getPagePath(current - 2, path, pageAlias)}>
              <div className={cn(classNumber, { 'ml-2': current !== 4 })}>{current - 2}</div>
            </Link>
          )}

          {current > 1 && (
            <Link href={getPagePath(current - 1, path, pageAlias)}>
              <div className={cn(classNumber, { 'ml-2': current <= 2 })}>{current - 1}</div>
            </Link>
          )}

          {/* Current */}
          {
            <div
              className={cn(classCurrent, {
                'mx-1': current !== 1 && current !== total,
                'mr-2': current === 1,
                'ml-2': current === total
              })}
            >
              {current}
            </div>
          }

          {total - current > 0 && (
            <Link href={getPagePath(current + 1, path, pageAlias)}>
              <div className={cn(classNumber, { 'mr-2': total - current <= 1 })}>{current + 1}</div>
            </Link>
          )}

          {total - current > 1 && (
            <Link href={getPagePath(current + 2, path, pageAlias)}>
              <div className={cn(classNumber, { 'mr-2': current !== total - 3 })}>
                {current + 2}
              </div>
            </Link>
          )}

          {/* last but right before is last-1, so we put inside the middle bar */}
          {current === total - 3 && (
            <Link href={getPagePath(total, path, pageAlias)}>
              <div className={cn(classNumber, 'mr-2')}>{total}</div>
            </Link>
          )}
        </div>

        {/* last */}
        {total - current > 3 && (
          <Link href={getPagePath(total, path, pageAlias)}>
            <div className={cn(classSeparated, 'ml-2')}>{total}</div>
          </Link>
        )}

        {/* Arrows right */}
        {total - current > 0 && (
          <Link href={getPagePath(current + 1, path, pageAlias)}>
            <div className={cn(classArrow, 'ml-2')}>
              <ChevronRight size={24} />
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}

const getPagePath = (pageNumber: number, path: string, pageAlias?: string) => {
  const alias = pageAlias || 'page'
  return pageNumber === 1 ? path : `${path}${alias}/${pageNumber}/`
}
