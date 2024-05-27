'use client'

import FiSearch from '@notion-x/src/icons/FiSearch'
import IoCloseCircle from '@notion-x/src/icons/IoCloseCircle'
import { makeSlugText } from '@notion-x/src/lib/helpers'
import cn from 'classnames'
import Fuse from 'fuse.js'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Book, Tool } from '../../../interface'
import { StarIcon } from '../../icons/StarIcon'
import { TagBookIcon } from '../../icons/TagBookIcon'
import ToolItem from '../tools/ToolItem'

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
    tool => tagsToShow.every(type => tool.tag.includes(type)) || tagsToShow.length === 0
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
      <div className={cn('flex items-center gap-3 p-4 bg-white rounded-xl')}>
        <div className={cn('grid place-items-center text-slate-500')}>
          <FiSearch className="text-2xl" />
        </div>
        <input
          ref={inputRef}
          className={cn(
            'peer h-full w-full text-ellipsis bg-transparent pr-2 outline-none',
            'm2it-hide-wscb'
          )}
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
      <div
        className={cn(
          'flex items-center gap-3 flex-wrap md:flex-nowrap md:items-baseline justify-start sm:justify-start'
        )}
      >
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
              {tag === 'favorite' && (
                <StarIcon className="text-amber-400" style={{ fontSize: '1.25rem' }} />
              )}
              <div className="whitespace-nowrap text-base">{tag}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tool list */}
      <div className="flex flex-col gap-4">
        <div className="text-sm text-gray-600 italic">
          <strong className="font-medium">Remark</strong>: Click here to see my reviews (in
          Vietnamese) on Goodreads. I mostly read the Vietnamese versions of books. If I can{"'"}t
          find their English titles, I{"'"}ll use the Vietnamese titles instead. You can{' '}
          <Link className="m2it-link" href="/note/my-taste-of-reading/">
            read this article
          </Link>{' '}
          to know more about my taste in books.
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {booksToShow?.map((book: Book) => (
            <ToolItem key={book.id} type="book" tool={book as Tool & Book} hideDescription={true} />
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
