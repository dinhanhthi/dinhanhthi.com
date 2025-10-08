'use client'

import cn from 'classnames'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import HiSwitchHorizontal from '@/src/app/icons/HiSwitchHorizontal'

type LocalRouteChangeProps = {
  localHostname?: string // eg: localhost:3004
}

export default function LocalRouteChange(props: LocalRouteChangeProps) {
  const [hostname, setHostname] = useState('')
  const pathname = usePathname()

  // get the hostname
  useEffect(() => {
    if (window) {
      const hostname = window.location.hostname
      setHostname(hostname)
    }
  }, [])

  return (
    <>
      {hostname.length > 0 && (
        <button
          className={cn(
            'flex items-center justify-center',
            'fixed bottom-4 left-4 h-10 w-10 rounded-full bg-gray-200 p-2 hover:bg-gray-300'
          )}
          onClick={() => {
            const newHostname =
              hostname === 'localhost'
                ? `https://${process.env.NEXT_PUBLIC_SITE_DOMAIN}`
                : `${
                    props.localHostname ? `http://${props.localHostname}` : 'http://localhost:3004'
                  }`
            window.location.href = newHostname + pathname
          }}
        >
          <HiSwitchHorizontal className="text-xl" />
        </button>
      )}
    </>
  )
}
