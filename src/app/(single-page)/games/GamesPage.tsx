'use client'

import FiSearch from '@notion-x/src/icons/FiSearch'
import IoCloseCircle from '@notion-x/src/icons/IoCloseCircle'
import { makeSlugText } from '@notion-x/src/lib/helpers'
import cn from 'classnames'
import Fuse from 'fuse.js'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, createElement, useEffect, useRef, useState } from 'react'

import { Book, Game, Tool } from '../../../interface'
import { StarIcon } from '../../icons/StarIcon'
import { TagActionIcon } from '../../icons/TagActionIcon'
import { TagAdventureIcon } from '../../icons/TagAdventureIcon'
import TagAndroidIcon from '../../icons/TagAndroidIcon'
import { TagFarmIcon } from '../../icons/TagFarmIcon'
import { TagFightingIcon } from '../../icons/TagFightingIcon'
import { TagFPSIcon } from '../../icons/TagFpsIcon'
import TagIOSIcon from '../../icons/TagIOSIcon'
import TagLinuxIcon from '../../icons/TagLinuxIcon'
import TagMacOSIcon from '../../icons/TagMacOSIcon'
import { TagSwitchIcon } from '../../icons/TagNintendoIcon'
import { TagOpenWorldIcon } from '../../icons/TagOpenWorldIcon'
import { TagPartyIcon } from '../../icons/TagPartyIcon'
import { TagPuzzleIcon } from '../../icons/TagPuzzleIcon'
import { TagRPGIcon } from '../../icons/TagRpgIcon'
import { TagSportsIcon } from '../../icons/TagSportIcon'
import { TagStealthStrategyIcon } from '../../icons/TagStealthIcon'
import TagWindowsIcon from '../../icons/TagWindowsIcon'
import ToolItem from '../tools/ToolItem'

const iconTagList: { [x: string]: (props: React.SVGProps<SVGSVGElement>) => JSX.Element } = {
  favorite: StarIcon,
  adventure: TagAdventureIcon,
  action: TagActionIcon,
  android: TagAndroidIcon,
  farm: TagFarmIcon,
  fighting: TagFightingIcon,
  fps: TagFPSIcon,
  ios: TagIOSIcon,
  linux: TagLinuxIcon,
  macos: TagMacOSIcon,
  'open world': TagOpenWorldIcon,
  party: TagPartyIcon,
  puzzle: TagPuzzleIcon,
  rpg: TagRPGIcon,
  sports: TagSportsIcon,
  'stealth strategy': TagStealthStrategyIcon,
  switch: TagSwitchIcon,
  windows: TagWindowsIcon
}

export default function GamesPage(props: { games: Game[]; tags: string[] }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchResult, setSearchResult] = useState<Tool[]>(props.games)
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
        router.push('/games', { scroll: false })
      } else {
        router.push(`/games?tag=${tagsToShow.filter(item => item !== tag).join(',')}`, {
          scroll: false
        })
      }
      setTagsToShow(tagsToShow.filter(item => item !== tag))
    } else {
      setTagsToShow([...tagsToShow, tag])
      router.push(`/games?tag=${[...tagsToShow, tag].join(',')}`, { scroll: false })
    }
  }

  const toolsToShow = searchResult.filter(
    tool => tagsToShow.every(type => tool.tag.includes(type)) || tagsToShow.length === 0
  )

  const fuseOptions = {
    includeScore: false,
    keys: ['name', 'description', 'tag', 'keySearch']
  }

  const fuse = new Fuse(props.games, fuseOptions)

  function handleOnchangeInput(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    setQuery(value)
    if (value.length) {
      const result = fuse.search(value)
      setSearchResult(result?.map(item => item.item))
    } else {
      setSearchResult(props.games)
    }
  }

  function clearQuery() {
    setQuery('')
    setSearchResult(props.games)
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
          placeholder={'Search tools...'}
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
                    className: 'h-5 w-5'
                  })}
                </>
              )}
              <div className="whitespace-nowrap text-base">{tag}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tool list */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {toolsToShow?.map((tool: Tool) => (
            <ToolItem key={tool.id} tool={tool as Tool & Book} showFavoriteStar={true} />
          ))}
        </div>
        {!toolsToShow.length && (
          <div className="text-slate-500 flex gap-2 items-center justify-center w-full">
            <TagSwitchIcon className="text-2xl" />
            <div>No games found.</div>
          </div>
        )}
      </div>
    </div>
  )
}

export function SkeletonToolItem() {
  return (
    <div className="p-2 bg-white rounded-lg border border-slate-150">
      <div className="flex flex-row h-full">
        <div className="w-[90px] h-full rounded-l-lg relative overflow-hidden shrink-0 border-[0.5px] border-slate-100">
          <div className="relative w-full h-full overflow-hidden">
            <div
              style={{
                position: 'absolute',
                inset: '0px',
                backgroundImage: `
                  linear-gradient(#f0f0f0, #f0f0f0),
                  linear-gradient(transparent, transparent),
                  url()`,
                backgroundBlendMode: 'luminosity, overlay, normal',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center top',
                backgroundSize: '100% 100%',
                filter: 'blur(25px) saturate(1)',
                transform: 'var(1.5) translate3d(0, 0, 0)'
              }}
            ></div>
            <div className="flex items-center justify-center p-8">
              <div className="animate-pulse w-[60px] h-[60px] max-w-[60px] absolute inset-0 m-auto rounded-full bg-slate-200"></div>
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1 flex flex-col gap-4 p-3 pl-4 animate-pulse">
          <div className="flex gap-1.5 flex-col">
            <div className="font-semibold text-slate-700">
              <div className="w-1/2 h-5 bg-slate-100 rounded-md"></div>
            </div>
            <div className="flex flex-wrap gap-x-1 gap-y-2 text-[0.75rem]">
              <div className="w-8 h-3 bg-slate-100 rounded-md"></div>
              <div className="w-8 h-3 bg-slate-100 rounded-md"></div>
            </div>
          </div>
          <div className="text-[0.83rem] text-slate-700 break-words overflow">
            <div className="w-full h-3 bg-slate-100 rounded-md"></div>
            <div className="w-4/5 h-3 bg-slate-100 rounded-md mt-1"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
