'use client'

import AiOutlineLoading3Quarters from '@/src/app/icons/AiOutlineLoading3Quarters'
import FiSearch from '@/src/app/icons/FiSearch'
import IoBookOutline from '@/src/app/icons/IoBookOutline'
import IoDocumentTextOutline from '@/src/app/icons/IoDocumentTextOutline'
import { useOperatingSystem } from '@/src/hooks/useOperatingSystem'
import { SearchResult } from '@/src/lib/types'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import cn from 'classnames'
import { Command } from 'cmdk'
import { debounce, get } from 'lodash'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../ui/dialog'
import { navLabelClass } from './Nav'

export default function NavSearch() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const os = useOperatingSystem()

  const { data, error, isLoading } = useSWR<SearchResult[]>(
    ['/api/search-notion', { query: query }],
    ([url, params]: any) => fetcher(url, params),
    { revalidateOnFocus: false }
  )

  if (error) console.log('🐞 Error in search modal: ', error)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [setIsOpen])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = useCallback(
    debounce(value => triggerSearch(value), 300),
    [query]
  )

  function triggerSearch(value: string) {
    setQuery(value)
  }

  const handleItemClick = (uri: string) => {
    setIsOpen(false)
    router.push(uri)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className={cn('flex flex-1 justify-end')}>
            <button
              type="button"
              className="group flex h-full items-center justify-center gap-2 rounded-md px-2 py-1.5 text-slate-300 hover:bg-gray-700 hover:text-white focus:outline-none"
              onClick={() => setIsOpen(true)}
            >
              <div>
                <FiSearch className="h-5 w-5" />
              </div>
              <div className={cn('flex items-center gap-2', navLabelClass)}>
                <span className="hidden whitespace-nowrap sm:inline">Search for notes</span>
                <span className="inline whitespace-nowrap sm:hidden">Search</span>
                <span className="hidden rounded-sm border-[0.5px] border-[#555] bg-[#65666b30] px-1 text-[0.7rem] whitespace-nowrap sm:inline-block">
                  {`${os === 'mac' ? '⌘' : 'Ctrl'}+K`}
                </span>
              </div>
            </button>
          </div>
        </DialogTrigger>
        <DialogContent
          className={cn(
            'h-[min(80svh,440px)] max-w-[80%] overflow-hidden rounded-lg border-none !p-0 shadow-[0_14px_62px_0_rgba(0,0,0,0.25)] md:max-w-[680px] md:min-w-[680px]'
          )}
          hideCloseBtn={true}
        >
          <VisuallyHidden.Root>
            <DialogTitle>Search notes</DialogTitle>
            <DialogDescription>Search through your notes</DialogDescription>
          </VisuallyHidden.Root>

          <Command
            className="flex h-full flex-col divide-y divide-slate-200 overflow-hidden"
            shouldFilter={false}
            loop
          >
            <div className="flex min-h-14 items-center justify-between gap-3 border-none p-3">
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
              <Command.Input
                ref={inputRef}
                className="placeholder:text-token-text-tertiary w-full border-none bg-transparent focus:border-transparent focus:ring-0 focus:outline-none"
                placeholder="Search for notes..."
                onValueChange={value => {
                  debounceSearch(value)
                }}
              />
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="iconBig"
                className="group rounded-full"
                tooltip="Close search (ESC)"
              >
                <X className="text-slate-800 opacity-50 group-hover:opacity-100" />
              </Button>
            </div>
            <Command.List asChild className="h-full min-h-0 flex-1 overflow-y-auto p-1.5">
              <Command.Empty className="flex h-full w-full items-center justify-center px-4 py-2 text-sm text-slate-500">
                No note found!
              </Command.Empty>
              {data && !data?.[0]?.isFake && query && (
                <>
                  {data.map((item, index) => {
                    const uri = `/note/${item.slug}/`
                    return (
                      <Command.Item
                        key={index}
                        value={uri}
                        className="group mb-1 flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm outline-none hover:bg-slate-100 hover:text-slate-800 aria-selected:bg-slate-100 aria-selected:text-slate-800"
                        onSelect={() => handleItemClick(uri)}
                        onClick={() => handleItemClick(uri)}
                      >
                        <div>
                          {!item.isBookPost && (
                            <IoDocumentTextOutline className="text-xl opacity-80" />
                          )}
                          {item.isBookPost && <IoBookOutline className="text-xl opacity-80" />}
                        </div>
                        <div className={cn('flex w-full flex-col gap-1 text-slate-900')}>
                          <div className={cn('flex w-full items-center justify-between')}>
                            <div
                              className={cn(
                                {
                                  'border-b border-dashed border-slate-300 pr-4 pb-1':
                                    item.textHighlighted
                                },
                                'text-[0.9rem] font-medium text-black'
                              )}
                            >
                              {item.titleHighlighted && (
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: item.titleHighlighted
                                  }}
                                ></span>
                              )}
                              {!item.titleHighlighted && <span>{item.title}</span>}
                            </div>
                          </div>
                          {item.textHighlighted && (
                            <div
                              className="text-sm opacity-90"
                              dangerouslySetInnerHTML={{ __html: item.textHighlighted }}
                            ></div>
                          )}
                        </div>
                      </Command.Item>
                    )
                  })}
                </>
              )}
            </Command.List>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}

const fetcher = async (url: string, params: any) => {
  if (params.query === '') return [{ isFake: true, isPublished: true }]
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
