import { useEffect, useState } from 'react'

export function useOperatingSystem() {
  const [os, setOs] = useState<'windows' | 'mac' | 'linux' | 'unknown'>('unknown')

  useEffect(() => {
    const platform = (navigator as any).userAgentData?.platform || navigator.platform
    const userAgent = navigator.userAgent.toLowerCase()

    if (platform.toLowerCase().includes('mac') || /mac|iphone|ipod|ipad/.test(userAgent)) {
      setOs('mac')
    } else if (platform.toLowerCase().includes('win') || /win/.test(userAgent)) {
      setOs('windows')
    } else if (/linux/.test(platform.toLowerCase()) || /linux/.test(userAgent)) {
      setOs('linux')
    }
  }, [])

  return os
}
