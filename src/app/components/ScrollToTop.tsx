'use client'

import cn from 'classnames'
import { ArrowUpToLine } from 'lucide-react'
import { useEffect, useRef } from 'react'

type ScrollToTopProps = {
  className?: string
  positionClassName?: string
}

export default function ScrollToTop(props: ScrollToTopProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const button = buttonRef.current
    if (!button) return
    const scrollHandler = () => {
      if (window.scrollY > 100) {
        button.classList.remove('opacity-0')
        button.classList.add('opacity-100')
      } else {
        button.classList.add('opacity-0')
        button.classList.remove('opacity-100')
      }
    }
    window.addEventListener('scroll', scrollHandler)
    return () => {
      window.removeEventListener('scroll', scrollHandler)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      ref={buttonRef}
      className={cn(
        'group fixed z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 p-2 opacity-0 transition-all duration-300 hover:cursor-pointer hover:bg-slate-300',
        props.positionClassName ? props.positionClassName : 'right-10 bottom-8'
      )}
    >
      <ArrowUpToLine className="text-muted h-6 w-6" />
    </button>
  )
}
