'use client'

import { useOperatingSystem } from '@/src/hooks/useOperatingSystem'
import { SearchResult } from '@/src/lib/types'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import cn from 'classnames'
import { Command } from 'cmdk'
import { debounce, get } from 'lodash'
import { BookOpen, FileText, LoaderCircle, Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../ui/dialog'
import { buttonClass } from './Nav'

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

  const debounceSearch = useCallback(
    debounce(value => triggerSearch(value), 300),
    [query]
  )

  function triggerSearch(value: string) {
    setQuery(value)
  }

  const handleItemClick = (uri: string) => {
    setIsOpen(false)
    setQuery('')
    // Small delay to ensure dialog closes before navigation
    setTimeout(() => {
      router.push(uri)
    }, 50)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setQuery('')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {/* Don't apply dark/light mode to this button because it's in nav which is always dark */}
        <button
          type="button"
          className={cn(
            'group flex h-full items-center justify-center rounded-md p-1.5 hover:cursor-pointer focus:outline-none',
            buttonClass
          )}
          onClick={() => setIsOpen(true)}
          aria-label={`Search for notes (${os === 'mac' ? '⌘' : 'Ctrl'}+K)`}
        >
          <Search size={18} />
        </button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          'flex max-h-[80vh] max-w-[80%] flex-col rounded-lg !border-none !p-0 shadow-[0_14px_62px_0_rgba(0,0,0,0.25)] md:max-w-[680px] md:min-w-[680px]'
        )}
        hideCloseBtn={true}
      >
        <VisuallyHidden.Root>
          <DialogTitle>Search notes</DialogTitle>
          <DialogDescription>Search through your notes</DialogDescription>
        </VisuallyHidden.Root>

        <Command
          className="divide-border-muted flex h-full min-h-0 flex-1 flex-col divide-y"
          shouldFilter={false}
          loop
        >
          <div className="flex h-14 items-center justify-between gap-3 border-none p-3">
            <div className={cn('text-muted grid place-items-center')}>
              {(data || error || get(data, '[0].isFake')) && !isLoading && <Search size={24} />}
              {isLoading && (
                <div className="animate-spin">
                  <LoaderCircle size={25} />
                </div>
              )}
            </div>
            <Command.Input
              ref={inputRef}
              className="placeholder:text-muted w-full bg-transparent focus:border-transparent focus:ring-0 focus:outline-none"
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
              <X className="text-text opacity-50 group-hover:opacity-100" />
            </Button>
          </div>

          {query && !isLoading && (
            <Command.List
              asChild
              className="thi-scrollbar thi-scrollbar-small h-full min-h-0 flex-1 overflow-y-auto p-1.5"
            >
              <Command.Empty className="text-muted flex h-full w-full items-center justify-center px-4 pt-8 pb-10 text-sm">
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
                        className="group hover:bg-bg-hover hover:text-text aria-selected:bg-bg-hover aria-selected:text-text mb-1 flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm outline-none"
                        onSelect={() => handleItemClick(uri)}
                        onClick={() => handleItemClick(uri)}
                      >
                        <div>
                          {!item.isBookPost && <FileText size={20} className="opacity-80" />}
                          {item.isBookPost && <BookOpen size={20} className="opacity-80" />}
                        </div>
                        <div className={cn('text-text flex w-full flex-col gap-1')}>
                          <div className={cn('flex w-full items-center justify-between')}>
                            <div
                              className={cn(
                                {
                                  'border-border-muted border-b border-dashed pr-4 pb-1':
                                    item.textHighlighted
                                },
                                'text-text text-[0.9rem] font-medium'
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
                              className="text-muted text-sm opacity-90"
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
          )}

          {query && data && data.length > 0 && (
            <div className="p-3 pl-4 text-xs font-normal text-green-800 dark:text-green-300">
              Found <span className="font-semibold">{data.length}</span> results
            </div>
          )}
        </Command>
      </DialogContent>
    </Dialog>
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
