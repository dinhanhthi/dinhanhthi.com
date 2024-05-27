'use client'

import FiSearch from '@notion-x/src/icons/FiSearch'
import IoCloseCircle from '@notion-x/src/icons/IoCloseCircle'
import { makeSlugText } from '@notion-x/src/lib/helpers'
import cn from 'classnames'
import Fuse from 'fuse.js'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, createElement, useEffect, useRef, useState } from 'react'

import Link from 'next/link'
import { Book, Tool } from '../../../interface'
import PiToolboxDuotone from '../../icons/PiToolboxDuotone'
import TagAndroidIcon from '../../icons/TagAndroidIcon'
import TagBrowserExtensionIcon from '../../icons/TagBrowserExtensionIcon'
import TagDevIcon from '../../icons/TagDevIcon'
import TagEducationIcon from '../../icons/TagEducationIcon'
import TagIOSIcon from '../../icons/TagIOSIcon'
import TagLinuxIcon from '../../icons/TagLinuxIcon'
import TagMacOSIcon from '../../icons/TagMacOSIcon'
import TagRelaxIcon from '../../icons/TagRelaxIcon'
import TagVSCodeIcon from '../../icons/TagVSCodeIcon'
import TagWebAppIcon from '../../icons/TagWebAppIcon'
import TagWindowsIcon from '../../icons/TagWindowsIcon'
import ToolItem from './ToolItem'

const iconTagList: { [x: string]: (props: React.SVGProps<SVGSVGElement>) => JSX.Element } = {
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
  windows: TagWindowsIcon
}

export default function ToolsPage(props: { tools: Tool[]; tags: string[] }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchResult, setSearchResult] = useState<Tool[]>(props.tools)
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
        router.push('/tools', { scroll: false })
      } else {
        router.push(`/tools?tag=${tagsToShow.filter(item => item !== tag).join(',')}`, {
          scroll: false
        })
      }
      setTagsToShow(tagsToShow.filter(item => item !== tag))
    } else {
      setTagsToShow([...tagsToShow, tag])
      router.push(`/tools?tag=${[...tagsToShow, tag].join(',')}`, { scroll: false })
    }
  }

  const toolsToShow = searchResult.filter(
    tool => tagsToShow.every(type => tool.tag.includes(type)) || tagsToShow.length === 0
  )

  const fuseOptions = {
    includeScore: false,
    keys: ['name', 'description', 'tag', 'keySearch']
  }

  const fuse = new Fuse(props.tools, fuseOptions)

  function handleOnchangeInput(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    setQuery(value)
    if (value.length) {
      const result = fuse.search(value)
      setSearchResult(result?.map(item => item.item))
    } else {
      setSearchResult(props.tools)
    }
  }

  function clearQuery() {
    setQuery('')
    setSearchResult(props.tools)
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

      <div className="text-gray-800 border p-4 bg-green-100 rounded-md">
        <span className="mr-2">👉</span> In addition to the tools on this page, you can explore
        other useful tools{' '}
        <Link className="m2it-link" href="/bookmarks/?tag=tools">
          here
        </Link>
        !
      </div>

      {/* Tool list */}
      <div className="flex flex-col gap-4">
        <div className="text-sm text-gray-600 italic">
          <strong className="font-medium">Remark</strong>: &quot;free&quot; means that the free
          features are enough for me to use, the tools may have paid features. &quot;paid&quot;
          means that I have to pay to use the features I need.
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {toolsToShow?.map((tool: Tool) => (
            <ToolItem key={tool.id} tool={tool as Tool & Book} />
          ))}
        </div>
        {!toolsToShow.length && (
          <div className="text-slate-500 flex gap-2 items-center justify-center w-full">
            <PiToolboxDuotone className="text-2xl" />
            <div>No tools found.</div>
          </div>
        )}
      </div>
    </div>
  )
}

export function SkeletonToolItem() {
  return (
    <div className="p-2 bg-white rounded-lg border border-slate-150">
      <div className={cn('flex flex-row h-full')}>
        <div
          className={cn(
            'w-[90px] h-full rounded-l-lg relative overflow-hidden shrink-0 border-[0.5px] border-slate-100'
          )}
        >
          <div className={cn('relative w-full h-full overflow-hidden')}>
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
            <div className={cn('flex items-center justify-center p-8')}>
              <div
                className={cn(
                  'animate-pulse w-[60px] h-[60px] max-w-[60px] absolute inset-0 m-auto rounded-full bg-slate-200'
                )}
              ></div>
            </div>
          </div>
        </div>
        <div className={cn('min-w-0 flex-1 flex flex-col gap-4 p-3 pl-4 animate-pulse')}>
          <div className="flex gap-1.5 flex-col">
            <div className="font-semibold text-slate-700">
              <div className="w-1/2 h-5 bg-slate-100 rounded-md"></div>
            </div>
            <div className={cn('flex flex-wrap gap-x-1 gap-y-2 text-[0.75rem]')}>
              <div className="w-8 h-3 bg-slate-100 rounded-md"></div>
              <div className="w-8 h-3 bg-slate-100 rounded-md"></div>
            </div>
          </div>
          <div className={cn('text-[0.83rem] text-slate-700 break-words overflow')}>
            <div className="w-full h-3 bg-slate-100 rounded-md"></div>
            <div className="w-4/5 h-3 bg-slate-100 rounded-md mt-1"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
