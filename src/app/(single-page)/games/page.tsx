import ToolsIcon from '@/public/tools.webp'
import cn from 'classnames'
import { Suspense } from 'react'

import ScrollToTop from '@notion-x/src/components/ScrollToTop'
import Container from '../../components/Container'
import Footer from '../../components/Footer'
import HeaderPage from '../../components/HeaderPage'
import { SkeletonSearchBar } from '../../components/SkeletonSearchBar'
import { bodyPadding, containerWide } from '../../lib/config'
import { getUnofficialGames } from '../../lib/fetcher'
import { getMetadata } from '../../lib/helpers'
import { SkeletonToolItem } from '../tools/ToolsPage'
import GamesPage from './GamesPage'

export const revalidate = 20

const title = 'Games I like'
const description =
  'Games make me happy and my life more balanced. Here are some of my favorite games.'

export const metadata = getMetadata({
  title,
  description,
  images: [`/api/og?title=${encodeURI(title)}&description=${encodeURI(description)}`]
})

export default async function GamesHomePage() {
  const { games } = await getUnofficialGames()

  // Get all unique tags from current games
  const tags: string[] = Array.from(new Set(games.flatMap(game => game.tags)))

  // Sort tags alphabetically
  tags.sort()

  // Make sure the 'favorite' tag is always at the beginning
  tags.sort((a, b) => (a === 'favorite' ? -1 : b === 'favorite' ? 1 : 0))

  return (
    <div className="thi-bg-stone flex flex-col">
      <HeaderPage
        headerType="gray"
        title={title}
        subtitle={description}
        headerWidth="wide"
        icon={{ staticImageData: ToolsIcon }}
        iconClassName="h-12 w-12"
        number={games.length}
      />
      <Container className={cn('basis-auto grow shrink-0', bodyPadding, containerWide)}>
        <Suspense fallback={<SkeletonToolContainer />}>
          <GamesPage games={games} tags={tags} />
        </Suspense>
      </Container>
      <Footer footerType="gray" />
      <ScrollToTop />
    </div>
  )
}

function SkeletonToolContainer() {
  return (
    <div className="flex flex-col gap-6">
      <SkeletonSearchBar placeholder="Search tools..." />
      <div className="flex items-center gap-x-4 gap-y-2 flex-wrap justify-center sm:justify-start">
        <div className="flex gap-x-2 gap-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-6 w-20 bg-white rounded-md animate-pulse"></div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonToolItem key={i} />
        ))}
      </div>
    </div>
  )
}
