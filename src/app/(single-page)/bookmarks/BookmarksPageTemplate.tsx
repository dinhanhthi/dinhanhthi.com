'use client'

import Pagination from '@notion-x/src/components/Pagination'
import AiOutlineLoading3Quarters from '@notion-x/src/icons/AiOutlineLoading3Quarters'
import FiSearch from '@notion-x/src/icons/FiSearch'
import IoCloseCircle from '@notion-x/src/icons/IoCloseCircle'
import cn from 'classnames'
import { debounce, get } from 'lodash'
import { ChangeEvent, useCallback, useRef, useState } from 'react'
import useSWR from 'swr'

import { BookmarkItem } from '../../../interface'
import BsFillBookmarkHeartFill from '../../icons/BsFillBookmarkHeartFill'
import BookmarkItemSimpleTemplate from './BookmarkItemSimpleTemplate'

type BookmarksPageProps = {
  bookmarks: BookmarkItem[]
  totalPages: number
  currentPage: number
  startIndex: number
}

export default function BookmarksPageTemplate(props: BookmarksPageProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [queryToSearch, setQueryToSearch] = useState(query)

  const { data, error, isLoading } = useSWR<any[]>(
    ['/api/search-bookmarks', { query: queryToSearch }],
    ([url, params]: any) => fetcher(url, params)
  )

  if (error) console.log('🐞 Error when searching bookmarks: ', error)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = useCallback(
    debounce(value => triggerSearch(value), 1000),
    [queryToSearch]
  )

  function handleOnchangeInput(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    setQuery(value)
    debounceSearch(value)
  }

  function triggerSearch(value: string) {
    setQueryToSearch(value)
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        👉{' '}
        <a className="m2it-link" target="_blank" href="https://github.com/dinhanhthi?tab=stars">
          My starred repositories
        </a>{' '}
        on Github.
      </div>
      {/* Search */}
      <div className={cn('flex items-center gap-3 p-4 bg-white rounded-md')}>
        <div className={cn('grid place-items-center text-slate-500')}>
          {(data || error || get(data, '[0].isFake')) && !isLoading && (
            <FiSearch className="text-2xl" />
          )}
          {isLoading && (
            <div className="animate-spin">
              <AiOutlineLoading3Quarters className="text-2xl" />
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          className={cn(
            'peer h-full w-full text-ellipsis bg-transparent pr-2 outline-none',
            'm2it-hide-wscb'
          )}
          id="search"
          type="search"
          placeholder={'Search bookmarks...'}
          autoComplete="off"
          value={query}
          onChange={e => handleOnchangeInput(e)}
        />
        {query && (
          <button onClick={() => setQuery('')}>
            <IoCloseCircle className="h-5 w-5 text-slate-500" />
          </button>
        )}
      </div>

      {/* Bookmarks list */}
      <div className="flex flex-col gap-4">
        {!query.length && (
          <>
            <div className="italic text-sm text-slate-600">
              Descriptions are sometimes fetched automatically from the bookmark!
            </div>
            <div className="grid grid-cols-1 gap-4">
              {props.bookmarks.map((mark: BookmarkItem, index: number) => (
                <BookmarkItemSimpleTemplate
                  key={mark.id}
                  mark={mark}
                  index={props.startIndex + index}
                />
              ))}
            </div>
          </>
        )}
        {query.length > 0 && (
          <div className="flex gap-8 flex-col">
            {!!data && !isLoading && (
              <>
                {error && (
                  <div className="p-4 text-center text-base">
                    There was an error fetching the search results.
                  </div>
                )}
                {!data?.[0]?.isFake && (
                  <>
                    {data.length === 0 && (
                      <div className="text-slate-500 flex gap-2 items-center justify-center w-full">
                        <BsFillBookmarkHeartFill className="text-2xl" />
                        <div>No bookmark found.</div>
                      </div>
                    )}
                    {data.length > 0 && (
                      <div className="grid grid-cols-1 gap-4">
                        {data.map((mark: BookmarkItem, index: number) => (
                          <BookmarkItemSimpleTemplate key={mark.id} mark={mark} index={index} />
                        ))}
                      </div>
                    )}
                    <button
                      className={cn(
                        'bg-slate-100 hover:bg-slate-200 w-fit px-6 py-1 rounded-2xl mx-auto text-sm',
                        'text-slate-800 border-slate-300 border-[0.5px]'
                      )}
                      onClick={() => setQuery('')}
                    >
                      Show all
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        )}
        {query.length === 0 && props.totalPages > 1 && (
          <Pagination
            className="my-8"
            path={'/bookmarks/'}
            total={props.totalPages}
            current={props.currentPage}
            pageAlias="page"
          />
        )}
      </div>
    </div>
  )
}

const fetcher = async (url: string, params: any) => {
  if (params.query === '') return [{ isFake: true }]
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json'
  }
  const res = await fetch(url, {
    headers,
    method: 'POST',
    body: JSON.stringify(params),
    mode: 'cors'
  })
  const json = await res.json()
  return json
}
