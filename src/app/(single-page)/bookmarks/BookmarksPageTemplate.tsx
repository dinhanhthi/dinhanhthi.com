'use client'

import IoCloseCircle from '@notion-x/src/icons/IoCloseCircle'
import cn from 'classnames'
import { ChangeEvent, createElement, useEffect, useRef, useState } from 'react'

import { makeSlugText } from '@notion-x/src/lib/helpers'
import Fuse from 'fuse.js'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { BookmarkItem } from '../../../interface'
import BsFillBookmarkHeartFill from '../../icons/BsFillBookmarkHeartFill'
import { StarIcon } from '../../icons/StarIcon'
import { TagAIIcon } from '../../icons/TagAIIcon'
import TagAndroidIcon from '../../icons/TagAndroidIcon'
import { TagBookIcon } from '../../icons/TagBookIcon'
import TagBrowserExtensionIcon from '../../icons/TagBrowserExtensionIcon'
import { TagDataIcon } from '../../icons/TagDataIcon'
import TagDevIcon from '../../icons/TagDevIcon'
import TagEducationIcon from '../../icons/TagEducationIcon'
import { TagGameIcon } from '../../icons/TagGameIcon'
import TagIOSIcon from '../../icons/TagIOSIcon'
import { TagLearningResourcesIcon } from '../../icons/TagLearningResourcesIcon'
import TagLinuxIcon from '../../icons/TagLinuxIcon'
import TagMacOSIcon from '../../icons/TagMacOSIcon'
import { TagMathIcon } from '../../icons/TagMathIcon'
import { TagMoocIcon } from '../../icons/TagMoocIcon'
import { TagPersonalSite } from '../../icons/TagPersonalSite'
import TagRelaxIcon from '../../icons/TagRelaxIcon'
import { TagToolsIcon } from '../../icons/TagToolsIcon'
import TagVSCodeIcon from '../../icons/TagVSCodeIcon'
import TagWebAppIcon from '../../icons/TagWebAppIcon'
import TagWindowsIcon from '../../icons/TagWindowsIcon'
import { TagYoutubeIcon } from '../../icons/TagYoutubeIcon'
import BookmarkItemSimpleTemplate from './BookmarkItemSimpleTemplate'

type BookmarksPageProps = {
  bookmarks: BookmarkItem[]
  tags: string[]
}

const iconTagList: { [x: string]: (props: React.SVGProps<SVGSVGElement>) => JSX.Element } = {
  favorite: StarIcon,
  android: TagAndroidIcon,
  'browser-extension': TagBrowserExtensionIcon,
  dev: TagDevIcon,
  ios: TagIOSIcon,
  linux: TagLinuxIcon,
  macos: TagMacOSIcon,
  relax: TagRelaxIcon,
  education: TagEducationIcon,
  'vscode-extension': TagVSCodeIcon,
  'web-app': TagWebAppIcon,
  windows: TagWindowsIcon,
  AI: TagAIIcon,
  'data science': TagDataIcon,
  'learning resources': TagLearningResourcesIcon,
  'personal site': TagPersonalSite,
  tools: TagToolsIcon,
  'web dev': TagWebAppIcon,
  youtube: TagYoutubeIcon,
  book: TagBookIcon,
  mooc: TagMoocIcon,
  games: TagGameIcon,
  math: TagMathIcon
}

export default function BookmarksPageTemplate(props: BookmarksPageProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchResult, setSearchResult] = useState<BookmarkItem[]>(props.bookmarks)
  const [query, setQuery] = useState('')
  const [tagsToShow, setTagsToShow] = useState<string[]>([])

  const router = useRouter()
  const searchParams = useSearchParams()
  const tags = searchParams.get('tag')

  useEffect(() => {
    if (tags && tags.length) {
      setTagsToShow(tags.split(',').map(item => item.split('-').join(' ')))
    }
  }, [tags])

  const toggleTypeToShow = (tag: string) => {
    if (tagsToShow.includes(tag)) {
      if (tagsToShow.length === 1) {
        router.push('/bookmarks', { scroll: false })
      } else {
        router.push(
          `/bookmarks?tag=${tagsToShow
            .filter(item => item !== tag)
            .map(item => item.split(' ').join('-'))
            .join(',')}`,
          {
            scroll: false
          }
        )
      }
      setTagsToShow(tagsToShow.filter(item => item !== tag))
    } else {
      setTagsToShow([...tagsToShow, tag])
      router.push(
        `/bookmarks?tag=${[
          ...tagsToShow.map(item => item.split(' ').join('-')),
          tag.split(' ').join('-')
        ].join(',')}`,
        { scroll: false }
      )
    }
  }

  const bookmarksToShow = searchResult.filter(
    bookmark => tagsToShow.every(type => bookmark.tags?.includes(type)) || tagsToShow.length === 0
  )

  const fuseOptions = {
    includeScore: false,
    keys: ['url', 'title', 'description', 'tags', 'keySearch']
  }

  const fuse = new Fuse(props.bookmarks, fuseOptions)

  function handleOnchangeInput(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    setQuery(value)
    if (value.length) {
      const result = fuse.search(value)
      setSearchResult(result?.map(item => item.item))
    } else {
      setSearchResult(props.bookmarks)
    }
  }

  function clearQuery() {
    setQuery('')
    setSearchResult(props.bookmarks)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div className={cn('flex items-center gap-3 p-4 bg-white rounded-md')}>
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
                  'bg-sky-600 text-white': tagsToShow.includes(tag) && tag !== 'favorite',

                  'bg-amber-500 text-white': tag === 'favorite' && tagsToShow.includes(tag)
                }
              )}
            >
              {iconTagList[tag] && (
                <>
                  {createElement(iconTagList[tag], {
                    className: cn('h-5 w-5')
                  })}
                </>
              )}
              <div className="whitespace-nowrap text-base">{tag}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="text-gray-800 border p-4 bg-green-100 rounded-md">
        <span className="mr-2">👉</span> In addition to the{' '}
        <span className="m2it-link cursor-pointer" onClick={() => toggleTypeToShow('tools')}>
          tools
        </span>{' '}
        on this page, you can explore other tools I{"'"}m using{' '}
        <Link className="m2it-link" href="/tools/">
          here
        </Link>
        !
      </div>

      {/* Bookmarks list */}
      <div className="flex flex-col gap-4">
        {!!bookmarksToShow.length && (
          <>
            <div className="italic text-sm text-slate-600">
              Descriptions are sometimes fetched automatically from the bookmark! The recently added
              ones come first.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarksToShow.map((mark: BookmarkItem, index: number) => (
                <BookmarkItemSimpleTemplate key={mark.id} mark={mark} index={index} />
              ))}
            </div>
          </>
        )}

        {!bookmarksToShow.length && (
          <div className="text-slate-500 flex gap-2 items-center justify-center w-full mt-8">
            <BsFillBookmarkHeartFill className="text-2xl" />
            <div>No bookmark found.</div>
          </div>
        )}
      </div>
    </div>
  )
}
