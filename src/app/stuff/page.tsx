import { Metadata } from 'next'
import StuffPageClient from './StuffPageClient'

export const metadata: Metadata = {
  title: 'Cool Stuff | Thi',
  description:
    'A collection of interesting bookmarks, tools, articles, and resources I find useful.'
}

export default function StuffPage() {
  return <StuffPageClient />
}
