// How to use? Put Comfortaa.className inside className
import { Open_Sans, Quicksand } from 'next/font/google'

export const openSans = Open_Sans({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  weight: ['400', '500'],
  variable: '--font-open-sans'
})

export const quicksand = Quicksand({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  weight: ['700']
})
