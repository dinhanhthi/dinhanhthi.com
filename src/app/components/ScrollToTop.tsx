'use client'

import cn from 'classnames'
import { ArrowUpToLine } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Button } from './ui/button'

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
    <Button
      variant="secondary"
      onClick={scrollToTop}
      ref={buttonRef}
      size="icon"
      className={cn(
        'border-border-muted fixed z-50 rounded-full border',
        props.positionClassName ? props.positionClassName : 'right-10 bottom-8'
      )}
    >
      <ArrowUpToLine className="text-muted h-6 w-6" />
    </Button>
  )
}
