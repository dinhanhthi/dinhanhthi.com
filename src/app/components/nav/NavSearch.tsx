'use client'

import SearchModal from '@notion-x/src/components/SearchModal'
import FiSearch from '@notion-x/src/icons/FiSearch'
import cn from 'classnames'
import { useEffect, useState } from 'react'
import { navLabelClass } from './Nav'

export default function NavSearch() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchKeyText, setSearchKeyText] = useState('Ctrl + K')

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setIsSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    const platform = navigator?.platform?.toLowerCase() || ''
    setSearchKeyText(platform.includes('mac') ? '⌘ K' : 'Ctrl K')

    // Remove event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <>
      <div className={cn('flex-1 flex justify-end')}>
        <button
          type="button"
          className="group h-full flex gap-2 items-center justify-center px-2 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-gray-700 focus:outline-none"
          onClick={() => setIsSearchOpen(true)}
        >
          <div>
            <FiSearch className="h-5 w-5" />
          </div>
          <div className={cn('flex items-center gap-2', navLabelClass)}>
            <span className="hidden sm:inline whitespace-nowrap">Search for notes</span>
            <span className="inline sm:hidden whitespace-nowrap">Search</span>
            <span className="text-[0.7rem] bg-[#65666b30] px-1 rounded-sm border-[#555] border-[0.5px] hidden sm:inline-block whitespace-nowrap">
              {searchKeyText}
            </span>
          </div>
        </button>
      </div>
      {isSearchOpen && (
        <SearchModal
          url="/api/search-notion"
          slugPrefix={'note'}
          isOpen={isSearchOpen}
          closeModal={() => setIsSearchOpen(false)}
          placeholder="Search for notes..."
        />
      )}
    </>
  )
}
