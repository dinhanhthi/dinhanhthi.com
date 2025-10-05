import { useEffect, useRef, useState } from 'react'

/**
 * Used to determine which heading is currently in view
 */
export function useHeadsObserver(headings?: string[]) {
  const observer = useRef<IntersectionObserver | null>(null)
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const handleObsever = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry?.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }

    observer.current = new IntersectionObserver(handleObsever, {
      rootMargin: '-100px 0% -80% 0px'
    })

    const elements = document.querySelectorAll(headings?.join(',') || 'h2, h3')
    elements.forEach(elem => observer?.current?.observe(elem))
    return () => observer.current?.disconnect()
  }, [headings])

  return { activeId }
}
