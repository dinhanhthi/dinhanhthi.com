'use client'

import FiSearch from '@notion-x/src/icons/FiSearch'
import IoCloseCircle from '@notion-x/src/icons/IoCloseCircle'
import { makeSlugText } from '@notion-x/src/lib/helpers'
import cn from 'classnames'
import Fuse from 'fuse.js'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, createElement, useEffect, useRef, useState } from 'react'
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
  fiction: TagFictionIcon,
  history: TagHistoryIcon,
  philosophy: TagPhilosophyIcon,
  'self help': TagSelfHelpIcon
}

export default function ReadingPage(props: { books: Book[]; tags: string[] }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchResult, setSearchResult] = useState<Book[]>(props.books)
  const [query, setQuery] = useState('')
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

  const booksToShow = searchResult.filter(
    book => tagsToShow.every(type => book.tags.includes(type)) || tagsToShow.length === 0
  )

  const fuseOptions = {
    includeScore: false,
    keys: ['title', 'description', 'tag', 'author', 'keySearch']
  }

  const fuse = new Fuse(props.books, fuseOptions)

  function handleOnchangeInput(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    setQuery(value)
    if (value.length) {
      const result = fuse.search(value)
      setSearchResult(result?.map(item => item.item))
    } else {
      setSearchResult(props.books)
    }
  }

  function clearQuery() {
    setQuery('')
    setSearchResult(props.books)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div className="flex items-center gap-3 p-4 bg-white rounded-xl">
        <div className="grid place-items-center text-slate-500">
          <FiSearch className="text-2xl" />
        </div>
        <input
          ref={inputRef}
          className="peer h-full w-full text-ellipsis bg-transparent pr-2 outline-none m2it-hide-wscb"
          id="search"
          type="search"
          placeholder={'Search books...'}
          autoComplete="off"
          value={query}
          onChange={e => handleOnchangeInput(e)}
        />
        {query && (
          <button onClick={() => clearQuery()}>
            <IoCloseCircle className="h-5 w-5 text-slate-500" />
          </button>
        )}
      </div>

      {/* Tags */}
      <div className="flex items-center gap-3 flex-wrap md:flex-nowrap md:items-baseline justify-start sm:justify-start">
        <div className="flex gap-2.5 flex-wrap items-center">
          {props.tags?.map(tag => (
            <button
              onClick={() => toggleTypeToShow(tag)}
              key={makeSlugText(tag)}
              className={cn(
                'border px-3 py-1.5 rounded-sm transition duration-200 ease-in-out flex flex-row gap-2 items-center text-slate-700',
                {
                  'bg-white hover:m2it-link-hover': !tagsToShow.includes(tag),
                  'bg-sky-600 text-white': tagsToShow.includes(tag)
                }
              )}
            >
              {iconTagList[tag] && (
                <>
                  {createElement(iconTagList[tag], {
                    className: cn('h-5 w-5', {
                      'text-amber-400': tag === 'favorite'
                    })
                  })}
                </>
              )}
              <div className="whitespace-nowrap text-base">{tag}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Reading list */}
      <div className="flex flex-col gap-4">
        <div className="text-base leading-normal text-gray-600 italic">
          <strong className="font-medium">Remark</strong>:{' '}
          <a
            className="m2it-link"
            href="https://www.goodreads.com/review/list/19630622-thi-dinh?shelf=read"
            target="_blank"
          >
            Click here
          </a>{' '}
          to see my reviews (in Vietnamese) on Goodreads. I mostly read the Vietnamese versions of
          books. If I can{"'"}t find their English titles, I{"'"}ll use the Vietnamese titles
          instead. <span className="font-medium">Read more:</span>{' '}
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
          on Goodreads.
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {booksToShow?.map((book: Book) => (
            <ToolItem
              key={book.id}
              type="book"
              tool={book as ToolItemInputType}
              hideDescription={true}
            />
          ))}
        </div>
        {!booksToShow.length && (
          <div className="text-slate-500 flex gap-2 items-center justify-center w-full">
            <TagBookIcon className="text-2xl" />
            <div>No books found.</div>
          </div>
        )}
      </div>
    </div>
  )
}
