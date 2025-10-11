'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Component that scrolls to the top of the page when the route changes,
 * but only if there's no hash/anchor in the URL.
 */
export default function ScrollToTopOnMount() {
  const pathname = usePathname()

  useEffect(() => {
    // Only scroll to top if there's no hash in the URL
    if (!window.location.hash) {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return null
}
