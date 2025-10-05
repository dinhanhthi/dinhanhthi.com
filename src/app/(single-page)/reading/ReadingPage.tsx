'use client'

import { makeSlugText } from '@/src/lib/helpers'
import { Book } from '@/src/lib/types'
import cn from 'classnames'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createElement, useEffect, useState } from 'react'
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
import ToolItem, { ToolItemInputType } from '../tools/ToolItem'

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
    <div className="flex flex-col gap-6">
      {/* Tags */}
      <div className="flex flex-wrap items-center justify-start gap-3 sm:justify-start md:flex-nowrap md:items-baseline">
        <div className="flex flex-wrap items-center gap-1.5">
          {props.tags?.map(tag => (
            <button
              onClick={() => toggleTypeToShow(tag)}
              key={makeSlugText(tag)}
              className={cn(
                'flex flex-row items-center gap-2 rounded-sm border px-3 py-1.5 text-slate-700 transition duration-200 ease-in-out',
                {
                  'hover:m2it-link-hover bg-white': !tagsToShow.includes(tag),
                  'bg-sky-600 text-white': tagsToShow.includes(tag)
                }
              )}
            >
              {iconTagList[tag] && (
                <>
                  {createElement(iconTagList[tag], {
                    className: cn('h-4 w-4', {
                      'text-amber-400': tag === 'favorite'
                    })
                  })}
                </>
              )}
              <div className="text-sm whitespace-nowrap">{tag}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Reading list */}
      <div className="flex flex-col gap-4">
        <div className="text-[0.9rem] leading-normal text-gray-600 italic">
          <span className="font-medium">Read more:</span>{' '}
          <Link className="m2it-link" href="/note/my-taste-of-reading/">
            My taste of reading
          </Link>
          , my{' '}
          <a
            className="m2it-link"
            href="https://www.goodreads.com/review/list/19630622-thi-dinh?ref=nav_mybooks&shelf=to-read"
            target="_blank"
          >
            want-to-read list
          </a>{' '}
          and{' '}
          <a
            className="m2it-link"
            href="https://www.goodreads.com/review/list/19630622-thi-dinh?shelf=read"
            target="_blank"
          >
            reviews
          </a>{' '}
          on Goodreads.
        </div>

        {/* Recently Read Section */}
        {recentlyReadBooks.length > 0 && (
          <div className="mb-6">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="font-heading mb-4 text-xl font-bold text-slate-700">Recently Read</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recentlyReadBooks.map((book: Book) => (
                  <ToolItem
                    key={book.id}
                    type="book"
                    tool={book as ToolItemInputType}
                    hideDescription={true}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notOthersToShow.map((book: Book) => (
            <ToolItem
              key={book.id}
              type="book"
              tool={book as ToolItemInputType}
              hideDescription={true}
            />
          ))}
        </div>
      </div>

      {othersToShow.length > 0 && (
        <>
          <h3 className="font-heading text-2xl font-bold text-slate-700">Others</h3>
          <ol className="list-decimal rounded-lg bg-white p-4 pl-11 leading-8">
            {othersToShow.map((book: Book) => (
              <li key={book.id}>
                <a href={book.url} target="_blank" className="group">
                  {/* NEW badge */}
                  {isBookNew(book) && (
                    <span className="mr-2 inline rounded-md bg-amber-200 px-2 py-0 align-middle text-[0.75rem] whitespace-nowrap text-amber-900">
                      new
                    </span>
                  )}
                  <span className="group-hover:m2it-link-hover font-medium text-slate-700">
                    {book.name}
                  </span>{' '}
                  {book.star && (
                    <>
                      <span className="inline-flex items-center text-slate-400">
                        (
                        {Array.from({ length: +book.star }).map((_, index) => (
                          <StarIcon key={index} className="text-sm" />
                        ))}
                        )
                      </span>{' '}
                    </>
                  )}
                  — <span className="text-sm text-slate-500">{book.author}</span>
                </a>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  )
}
