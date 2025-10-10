'use client'

import cn from 'classnames'
import { debounce, get } from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import useSWR from 'swr'

import AiOutlineLoading3Quarters from '@/src/app/icons/AiOutlineLoading3Quarters'
import BsArrowReturnLeft from '@/src/app/icons/BsArrowReturnLeft'
import FiSearch from '@/src/app/icons/FiSearch'
import IoBookOutline from '@/src/app/icons/IoBookOutline'
import IoCloseCircle from '@/src/app/icons/IoCloseCircle'
import IoDocumentTextOutline from '@/src/app/icons/IoDocumentTextOutline'
import { SearchResult } from '@/src/lib/types'
import { Dialog, DialogContent } from './ui/dialog'

type SearchModalProps = {
  url: string // Cannot use process.env because it will be undefined in the client side
  isOpen: boolean
  closeModal: () => void
  slugPrefix?: string
  className?: string
  errorMessage?: string
  noResultsMessage?: string
  foundResultsMessage?: string // should be in the format of 'Found {{count}} results'
  placeholder?: string
}

export default function SearchModal(props: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [queryToSearch, setQueryToSearch] = useState(query)
  const [selected, setSelected] = useState(-1)
  const router = useRouter()

  const { data, error, isLoading } = useSWR<SearchResult[]>(
    [props.url, { query: queryToSearch }],
    ([url, params]: any) => fetcher(url, params)
  )

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  if (error) console.log('🐞 Error in search modal: ', error)

  const debounceSearch = useCallback(
    debounce(value => triggerSearch(value), 1000),
    [queryToSearch]
  )

  function handleOnchangeInput(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    setQuery(value)
    debounceSearch(value)
  }

  // Auto scroll the search container when navigating with arrow keys
  useLayoutEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current
      const selectedItem = container.children[selected] as HTMLElement
      const view = checkIsInView(selectedItem, container)
      if (view === 'above') {
        container.scrollTo({
          top: selectedItem.offsetTop - container.offsetTop,
          behavior: 'smooth'
        })
      } else if (view === 'below') {
        container.scrollTo({
          top: selectedItem.offsetTop + selectedItem.offsetHeight - container.offsetHeight,
          behavior: 'smooth'
        })
      }
    }
  }, [selected])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      // navigate to the selected result
      if (data?.length && selected >= 0 && selected < data?.length) {
        const uri = props.slugPrefix
          ? `${props.slugPrefix}/${data[selected].slug}/`
          : `${data[selected].slug}/`
        e.preventDefault()
        props.closeModal()
        router.push(uri)
      } else {
        // trigger search
        triggerSearch(inputRef.current?.value || '')
        debounceSearch.cancel()
      }
    }

    // navigate between the results
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected(prev => (!data || prev < data.length - 1 ? prev + 1 : prev))
      // if before the arrow down, the selected item is the last item, set the selected to the first item
      if (data?.length && data?.length > 0 && selected === data?.length - 1) {
        setSelected(0)
      }
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected(prev => (prev > 0 ? prev - 1 : prev))
      // if before the arrow up, the selected item is the first item, set the selected to the last item
      if (data?.length && data?.length > 0 && selected === 0) {
        setSelected(data?.length - 1)
      }
    }
  }

  function handleMouseMoveCapture(index: number) {
    setSelected(index)
  }

  function triggerSearch(value: string) {
    setQueryToSearch(value)
    setSelected(-1)
  }

  return (
    <Dialog open={props.isOpen} onOpenChange={open => !open && props.closeModal()}>
      <DialogContent
        className={cn(
          'flex max-h-[80vh] w-full flex-col gap-0 divide-y divide-slate-200 rounded-md bg-white p-0 text-left align-middle text-slate-800 shadow-xl md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] 2xl:max-w-[50vw]',
          props.className
        )}
        hideCloseBtn={true}
      >
        {/* Search bar */}
        <div className={cn('flex items-center gap-3 p-4')}>
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
            className="peer m2it-hide-wscb h-full w-full bg-transparent pr-2 text-ellipsis outline-none"
            id="search"
            type="search"
            placeholder={props.placeholder || 'Search...'}
            autoComplete="off"
            value={query}
            onChange={e => handleOnchangeInput(e)}
            onKeyDown={e => handleKeyDown(e)}
          />
          {query && (
            <button onClick={() => setQuery('')}>
              <IoCloseCircle className="h-5 w-5 text-slate-500" />
            </button>
          )}
        </div>

        {/* Search results */}
        {error && (
          <div className="p-4 text-center text-base">
            {props.errorMessage || 'There was an error fetching the search results.'}
          </div>
        )}
        {data && !data?.[0]?.isFake && query && (
          <>
            {data.length === 0 && (
              <div className="p-4 text-center text-base">
                {props.noResultsMessage || 'No results found.'}
              </div>
            )}
            {data.length > 0 && (
              <div className={cn('flex flex-col divide-y divide-slate-200 overflow-hidden')}>
                <div
                  ref={containerRef}
                  className={cn(
                    'm2it-scrollbar flex flex-col divide-y divide-slate-200 overflow-auto'
                  )}
                >
                  {data.map((item, index) => {
                    const uri = props.slugPrefix
                      ? `/${props.slugPrefix}/${item.slug}/`
                      : `/${item.slug}/`
                    return (
                      <Link
                        onClick={props.closeModal}
                        href={uri}
                        key={item.id}
                        className={cn('flex w-full gap-3 px-4 py-4', {
                          'bg-gray-100': selected === index
                        })}
                        onMouseMoveCapture={() => handleMouseMoveCapture(index)}
                      >
                        <div className="mt-0.5">
                          {!item.isBookPost && (
                            <IoDocumentTextOutline className="text-xl opacity-80" />
                          )}
                          {item.isBookPost && <IoBookOutline className="text-xl opacity-80" />}
                        </div>
                        <div className={cn('flex w-full flex-col gap-1 text-slate-900')}>
                          <div className={cn('flex w-full items-center justify-between text-base')}>
                            <div
                              className={cn(
                                {
                                  'border-b border-dashed border-slate-300 pr-4 pb-1':
                                    item.textHighlighted
                                },
                                'font-medium text-black'
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
                            <div
                              className={cn({
                                visible: selected === index,
                                invisible: selected !== index
                              })}
                            >
                              <BsArrowReturnLeft className="text-lg opacity-70" />
                            </div>
                          </div>
                          {item.textHighlighted && (
                            <div
                              className="text-sm opacity-90"
                              dangerouslySetInnerHTML={{ __html: item.textHighlighted }}
                            ></div>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
                {query && (
                  <div className="p-3 pl-4 text-sm font-normal text-slate-500">
                    {props.foundResultsMessage?.split('{{count}}')[0] || 'Found '}
                    <span className="font-semibold text-slate-900">{data.length}</span>
                    {props.foundResultsMessage?.split('{{count}}')[1] || ' results'}
                  </div>
                )}
              </div>
            )}
          </>
        )}
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

function checkIsInView(selectedEl: HTMLElement, containerEl: HTMLElement) {
  const isOutBelow =
    selectedEl.offsetTop + selectedEl.offsetHeight - containerEl.scrollTop >
    containerEl.offsetHeight
  const isOutAbove = selectedEl.offsetTop < containerEl.scrollTop
  if (isOutAbove) {
    return 'above'
  } else if (isOutBelow) {
    return 'below'
  } else {
    return 'in'
  }
}
