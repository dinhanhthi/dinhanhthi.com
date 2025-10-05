import cn from 'classnames'
import Link from 'next/link'
import React from 'react'

import CgChevronLeft from '@/src/app/icons/CgChevronLeft'
import CgChevronRight from '@/src/app/icons/CgChevronRight'

type PaginationProps = {
  path: string
  total: number
  current: number
  className?: string
  pageAlias?: string
}

export default function Pagination(props: PaginationProps) {
  const { path, total, current, className, pageAlias } = props

  const iconSize = 'h-6 w-6'
  const hClass = 'h-9'
  const wClass = 'w-9'
  const sizeCurrentClass = 'h-12 w-12'
  const classNumber = `${hClass} ${wClass} hidden cursor-pointer items-center
    justify-center rounded-full leading-5 transition duration-150 ease-in !flex`
  const classCurrent = `${sizeCurrentClass} rounded-full bg-main text-white shadow-md
    items-center justify-center leading-5 transition duration-150 ease-in !flex`
  const classSeparated = `h-10 w-10 flex cursor-pointer items-center
    justify-center rounded-full bg-gray-200 hover:shadow-md`
  const classArrow = classSeparated + ' opacity-80 hover:opacity-100'
  return (
    <div className={cn('my-12 flex flex-col items-center', className)}>
      <div className="flex items-center text-gray-700">
        {/* Arrows left */}
        {current > 1 && (
          <Link href={getPagePath(current - 1, path, pageAlias)}>
            <div className={cn(classArrow, 'mr-2')}>
              <CgChevronLeft className={iconSize} />
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
            className={`absolute -z-10 flex ${hClass} w-full rounded-full bg-gray-200 font-medium shadow-md`}
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
              <CgChevronRight className={iconSize} />
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
