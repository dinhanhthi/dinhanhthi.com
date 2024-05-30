'use client'

import FiSearch from '@notion-x/src/icons/FiSearch'
import IoCloseCircle from '@notion-x/src/icons/IoCloseCircle'
import { makeSlugText } from '@notion-x/src/lib/helpers'
import cn from 'classnames'
import Fuse from 'fuse.js'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, createElement, useEffect, useRef, useState } from 'react'

import { Game, Tool } from '../../../interface'
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
import { TagStrategyIcon } from '../../icons/TagStrategyIcon'
import TagWindowsIcon from '../../icons/TagWindowsIcon'
import ToolItem, { ToolItemInputType } from '../tools/ToolItem'

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
  strategy: TagStrategyIcon,
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

  const gamesToShow = searchResult.filter(
    game => tagsToShow.every(type => game.tags.includes(type)) || tagsToShow.length === 0
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
          placeholder={'Search games...'}
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

      {/* Game list */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {gamesToShow?.map(game => (
            <ToolItem key={game.id} tool={game as ToolItemInputType} showFavoriteStar={true} />
          ))}
        </div>
        {!gamesToShow.length && (
          <div className="text-slate-500 flex gap-2 items-center justify-center w-full">
            <TagSwitchIcon className="text-2xl" />
            <div>No games found.</div>
          </div>
        )}
      </div>
    </div>
  )
}
