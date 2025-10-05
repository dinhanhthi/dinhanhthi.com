'use client'

import cn from 'classnames'
import React, { useEffect, useRef } from 'react'
import { BackToTopIcon } from '@/src/app/icons/BackToTopIcon'

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
        'fixed rounded-full p-2 opacity-0 transition-all duration-300 z-50 group bg-slate-200 hover:bg-slate-300 w-12 h-12 flex items-center justify-center',
        props.positionClassName ? props.positionClassName : 'right-10 bottom-8'
      )}
    >
      <BackToTopIcon className="w-6 h-6" />
    </button>
  )
}
