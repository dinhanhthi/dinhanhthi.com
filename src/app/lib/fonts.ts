// How to use? Put Comfortaa.className inside className
import { Comfortaa, Open_Sans } from 'next/font/google'

export const comfortaa = Comfortaa({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700']
})

export const openSans = Open_Sans({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  weight: ['400', '600'],
  variable: '--font-open-sans'
})
