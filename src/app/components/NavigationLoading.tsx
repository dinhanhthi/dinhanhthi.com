'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function NavigationLoading() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const prevPathRef = useRef(pathname + searchParams.toString())

  // Detect route change completion: when pathname/searchParams change, hide overlay
  useEffect(() => {
    const current = pathname + searchParams.toString()
    if (prevPathRef.current !== current) {
      prevPathRef.current = current
      setIsLoading(false)
    }
  }, [pathname, searchParams])

  // Intercept clicks on internal links to show loading overlay
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      if (!href) return

      // Skip external links, hash links, new tab links, and non-left clicks
      if (
        target.target === '_blank' ||
        target.origin !== window.location.origin ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return
      }

      // Skip if navigating to the same page
      const current = pathname + (searchParams.toString() ? '?' + searchParams.toString() : '')
      if (href === current || href === pathname) return

      setIsLoading(true)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [pathname, searchParams])

  if (!isLoading) return null

  return (
    <div className="navigation-loading-overlay">
      <div className="navigation-loading-spinner" />
    </div>
  )
}
