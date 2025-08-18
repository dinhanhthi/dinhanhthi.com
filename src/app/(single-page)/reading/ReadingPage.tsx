'use client'

import { makeSlugText } from '@notion-x/src/lib/helpers'
import cn from 'classnames'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createElement, useEffect, useState } from 'react'
import { Book } from '../../../interface'
import { StarIcon } from '../../icons/StarIcon'
import { TagAIIcon } from '../../icons/TagAIIcon'
import { TagBookIcon } from '../../icons/TagBookIcon'
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

const iconTagList: { [x: string]: (props: React.SVGProps<SVGSVGElement>) => JSX.Element } = {
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
              <div className="whitespace-nowrap text-sm">{tag}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Reading list */}
      <div className="flex flex-col gap-4">
        <div className="text-[0.9rem] italic leading-normal text-gray-600">
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {booksToShow
            ?.filter(book => !book.isOthers)
            .map((book: Book) => (
              <ToolItem
                key={book.id}
                type="book"
                tool={book as ToolItemInputType}
                hideDescription={true}
              />
            ))}
        </div>
        {!booksToShow.length && (
          <div className="flex w-full items-center justify-center gap-2 text-slate-500">
            <TagBookIcon className="text-2xl" />
            <div>No books found.</div>
          </div>
        )}
      </div>

      <h3 className="font-heading text-2xl font-bold text-slate-700">Others</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {booksToShow
          ?.filter(book => book.isOthers)
          .map((book: Book) => (
            <ToolItem key={book.id} type="book" tool={book as ToolItemInputType} isSimple={true} />
          ))}
      </div>
    </div>
  )
}
