'use client'

import { makeSlugText } from '@/src/lib/helpers'
import { Book } from '@/src/lib/types'
import cn from 'classnames'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { sectionOuterClass } from '../../../lib/config'
import HeadingPage, { SkeletonHeadingPage } from '../../components/HeadingPage'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { StarIcon } from '../../icons/StarIcon'
import { TagAIIcon } from '../../icons/TagAIIcon'
import { TagEconomicsIcon } from '../../icons/TagEconomicsIcon'
import TagEducationIcon from '../../icons/TagEducationIcon'
import { TagFictionIcon } from '../../icons/TagFictionIcon'
import { TagHistoryIcon } from '../../icons/TagHistoryIcon'
import { TagMathIcon } from '../../icons/TagMathIcon'
import { TagMemoirIcon } from '../../icons/TagMemoirIcon'
import { TagPersonalSite } from '../../icons/TagPersonalSite'
import { TagPhilosophyIcon } from '../../icons/TagPhilosophyIcon'
import { TagPsychologyIcon } from '../../icons/TagPsychologyIcon'
import { TagScienceIcon } from '../../icons/TagScienceIcon'
import { TagSelfHelpIcon } from '../../icons/TagSelfHelpIcon'
import { TagTechIcon } from '../../icons/TagTechIcon'
import TagWebAppIcon from '../../icons/TagWebAppIcon'
import BookItem, { SkeletonBookItem } from './BookItem'

const iconTagList: { [x: string]: (_props: React.SVGProps<SVGSVGElement>) => React.ReactElement } =
  {
    favorite: StarIcon,
    math: TagMathIcon,
    economics: TagEconomicsIcon,
    'AI-Data': TagAIIcon,
    science: TagScienceIcon,
    tech: TagTechIcon,
    'web dev': TagWebAppIcon,
    psychology: TagPsychologyIcon,
    biography: TagPersonalSite,
    memoir: TagMemoirIcon,
    education: TagEducationIcon,
    fiction: TagFictionIcon, // back compatibility
    novel: TagFictionIcon,
    history: TagHistoryIcon,
    philosophy: TagPhilosophyIcon,
    'self help': TagSelfHelpIcon
  }

// Helper function to determine if a book is new (within 7 days)
const isBookNew = (book: Book): boolean => {
  const now = new Date()
  const markDate = new Date(book.date)
  const diff = now.getTime() - markDate.getTime()
  const diffInDays = diff / (1000 * 3600 * 24)
  return diffInDays <= 7 && !book.isReading
}

export default function ReadingPage(props: { books: Book[]; tags: string[] }) {
  const [tagsToShow, setTagsToShow] = useState<string[]>([])

  const router = useRouter()
  const searchParams = useSearchParams()
  const tag = searchParams.get('tag')

  useEffect(() => {
    if (tag && tag.length) {
      setTagsToShow(tag.split(','))
    }
  }, [tag])

  const toggleTypeToShow = (tag: string) => {
    if (tagsToShow.includes(tag)) {
      if (tagsToShow.length === 1) {
        router.push('/reading', { scroll: false })
      } else {
        router.push(`/reading?tag=${tagsToShow.filter(item => item !== tag).join(',')}`, {
          scroll: false
        })
      }
      setTagsToShow(tagsToShow.filter(item => item !== tag))
    } else {
      setTagsToShow([...tagsToShow, tag])
      router.push(`/reading?tag=${[...tagsToShow, tag].join(',')}`, { scroll: false })
    }
  }

  const booksToShow = props.books.filter(
    book => tagsToShow.every(type => book.tags.includes(type)) || tagsToShow.length === 0
  )

  // Get recently read books (last 6 read books, excluding currently reading and others)
  const recentlyReadBooks = booksToShow
    .filter(book => !book.isReading && !book.isOthers)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)

  // Get IDs of recently read books to exclude from main list
  const recentlyReadIds = new Set(recentlyReadBooks.map(book => book.id))

  // Sort books: new books first, then alphabetically by name (excluding recently read)
  const notOthersToShow = booksToShow
    .filter(book => !book.isOthers && !recentlyReadIds.has(book.id))
    .sort((a, b) => {
      const aIsNew = isBookNew(a)
      const bIsNew = isBookNew(b)

      // If one is new and the other isn't, prioritize the new one
      if (aIsNew && !bIsNew) return -1
      if (!aIsNew && bIsNew) return 1

      // If both are new or both are not new, sort alphabetically by name
      return a.name.localeCompare(b.name)
    })

  // Sort "Others" books: new books first, then alphabetically by name
  const othersToShow = booksToShow
    .filter(book => book.isOthers)
    .sort((a, b) => {
      const aIsNew = isBookNew(a)
      const bIsNew = isBookNew(b)

      // If one is new and the other isn't, prioritize the new one
      if (aIsNew && !bIsNew) return -1
      if (!aIsNew && bIsNew) return 1

      // If both are new or both are not new, sort alphabetically by name
      return a.name.localeCompare(b.name)
    })

  return (
    <div className="flex flex-col gap-8">
      {/* Tags */}
      <div className={cn('flex flex-wrap items-center justify-start gap-3 p-2', sectionOuterClass)}>
        {props.tags?.map(tag => (
          <Button
            className={cn('flex flex-nowrap items-center gap-2 whitespace-nowrap', {
              '!border-border-muted': !tagsToShow.includes(tag),
              '!bg-link !text-bg hover:!bg-link hover:!text-bg': tagsToShow.includes(tag)
            })}
            size="sm"
            variant={tagsToShow.includes(tag) ? 'secondary' : 'outline'}
            onClick={() => toggleTypeToShow(tag)}
            key={makeSlugText(tag)}
          >
            {iconTagList[tag] &&
              (() => {
                const IconComponent = iconTagList[tag]
                return (
                  <IconComponent
                    className={cn('h-4 w-4', {
                      'text-amber-400': tag === 'favorite'
                    })}
                  />
                )
              })()}
            <div className="text-sm whitespace-nowrap">{tag}</div>
          </Button>
        ))}
      </div>

      {/* Reading list */}
      {recentlyReadBooks.length > 0 && (
        <div>
          <HeadingPage className="mb-2" title="Recently Read" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentlyReadBooks.map((book: Book) => (
              <BookItem key={book.id} book={book} hideDescription={true} />
            ))}
          </div>
        </div>
      )}

      {/* Read */}
      {notOthersToShow.length > 0 && (
        <div>
          <HeadingPage className="mb-2" title="Read" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notOthersToShow.map((book: Book) => (
              <BookItem key={book.id} book={book} hideDescription={true} />
            ))}
          </div>
        </div>
      )}

      {/* Others */}
      {othersToShow.length > 0 && (
        <div>
          <HeadingPage className="mb-2" title="Others" />
          <ol
            className={cn(
              'bg-bg marker:text-muted list-decimal rounded-lg p-4 pl-11 leading-8',
              sectionOuterClass
            )}
          >
            {othersToShow.map((book: Book) => (
              <li key={book.id}>
                <a href={book.url} target="_blank" className="group">
                  {/* NEW badge */}
                  {isBookNew(book) && (
                    <Badge
                      variant="secondary"
                      className="!bg-yellow-bg !text-yellow-text !border-none"
                    >
                      new
                    </Badge>
                  )}
                  <span className="text-text-heading group-hover:text-link-hover font-medium">
                    {book.name}
                  </span>{' '}
                  {book.star && (
                    <>
                      <span className="text-muted inline-flex items-center">
                        (
                        {Array.from({ length: +book.star }).map((_, index) => (
                          <StarIcon key={index} className="text-sm" />
                        ))}
                        )
                      </span>{' '}
                    </>
                  )}
                  — <span className="text-muted text-sm">{book.author}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

export const SkeletonReadingPage = () => {
  return (
    <div className="flex flex-col gap-8">
      <div
        className={cn(
          'flex flex-wrap items-center justify-center gap-3 p-2 sm:justify-start',
          sectionOuterClass
        )}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-skeleton-bg h-6 w-30 animate-pulse rounded-full"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBookItem key={i} />
        ))}
      </div>
      {/* Others */}
      <div>
        <SkeletonHeadingPage className="mb-4" />
        <div className={cn('flex flex-col gap-3 p-4', sectionOuterClass)}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-skeleton-bg h-5 animate-pulse rounded-full"
              style={{ width: `${20 + (i % 5) * 10}%` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}
