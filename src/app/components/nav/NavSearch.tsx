'use client'

import { useOperatingSystem } from '@/src/hooks/useOperatingSystem'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import cn from 'classnames'
import { Command } from 'cmdk'
import { debounce } from 'lodash'
import { FileText, LoaderCircle, Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../ui/dialog'
import { buttonClass } from './Nav'

type PagefindResult = {
  url: string
  meta?: { title?: string }
  excerpt?: string
}

let pagefindInstance: any = null

async function getPagefind() {
  if (pagefindInstance) return pagefindInstance
  try {
    // @ts-expect-error — pagefind is generated at build time, not a real module
    pagefindInstance = await import(/* webpackIgnore: true */ '/pagefind/pagefind.js')
    await pagefindInstance.init()
    return pagefindInstance
  } catch {
    console.warn('Pagefind not available — search disabled')
    return null
  }
}

export default function NavSearch() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PagefindResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const os = useOperatingSystem()

  const doSearch = useCallback(
    debounce(async (value: string) => {
      if (!value) {
        setResults([])
        setHasSearched(false)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const pagefind = await getPagefind()
        if (!pagefind) {
          setResults([])
          setHasSearched(true)
          setIsLoading(false)
          return
        }
        const search = await pagefind.search(value)
        const loaded = await Promise.all(search.results.slice(0, 20).map((r: any) => r.data()))
        setResults(loaded)
      } catch (err) {
        console.error('Search error:', err)
        setResults([])
      }
      setHasSearched(true)
      setIsLoading(false)
    }, 300),
    []
  )

  useEffect(() => {
    return () => doSearch.cancel()
  }, [doSearch])

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

  const handleItemClick = (url: string) => {
    setIsOpen(false)
    setQuery('')
    setResults([])
    setHasSearched(false)
    setTimeout(() => {
      router.push(url)
    }, 50)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setQuery('')
      setResults([])
      setHasSearched(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
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
        className="'flex md:min-w-[680px]' max-h-[80vh] max-w-[calc(100%-2rem)] flex-col !p-0 md:max-w-[680px]"
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
              {!isLoading && <Search size={24} />}
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
                setQuery(value)
                doSearch(value)
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

          {query && !isLoading && hasSearched && (
            <Command.List className="thi-scrollbar thi-scrollbar-small max-h-[60vh] overflow-y-auto p-1.5">
              <Command.Empty className="text-muted flex h-full w-full items-center justify-center px-4 pt-8 pb-10 text-sm">
                No note found!
              </Command.Empty>
              {results.length > 0 && (
                <>
                  {results.map((item, index) => {
                    const url = item.url.replace(/\.html$/, '').replace(/index$/, '')
                    const title = item.meta?.title || 'Untitled'
                    return (
                      <Command.Item
                        key={index}
                        value={url}
                        className="group hover:bg-bg-hover hover:text-text aria-selected:bg-bg-hover aria-selected:text-text mb-1 flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm outline-none"
                        onSelect={() => handleItemClick(url)}
                        onClick={() => handleItemClick(url)}
                      >
                        <div>
                          <FileText size={20} className="opacity-80" />
                        </div>
                        <div className={cn('text-text flex w-full flex-col gap-1')}>
                          <div
                            className={cn(
                              {
                                'border-border-muted border-b border-dashed pr-4 pb-1': item.excerpt
                              },
                              'text-text text-[0.9rem] font-medium'
                            )}
                          >
                            <span>{title}</span>
                          </div>
                          {item.excerpt && (
                            <div
                              className="text-muted text-sm opacity-90"
                              dangerouslySetInnerHTML={{ __html: item.excerpt }}
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

          {query && hasSearched && results.length > 0 && (
            <div className="text-muted p-3 pl-4 text-xs font-normal">
              Found{' '}
              <span className="font-semibold text-green-800 dark:text-green-300">
                {results.length}
              </span>{' '}
              results
            </div>
          )}
        </Command>
      </DialogContent>
    </Dialog>
  )
}
