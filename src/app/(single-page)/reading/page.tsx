import ReadingIcon from '@/public/reading.svg'
import cn from 'classnames'
import { Suspense } from 'react'

import ScrollToTop from '@/src/app/components/ScrollToTop'
import { bodyPadding } from '@/src/lib/config'
import { getUnofficialBooks } from '@/src/lib/fetcher'
import { getMetadata } from '@/src/lib/helpers'
import { Book } from '@/src/lib/types'
import Container from '../../components/Container'
import Footer from '../../components/Footer'
import HeaderPage from '../../components/HeaderPage'
import { SkeletonToolItem } from '../tools/ToolItem'
import ReadingPage from './ReadingPage'

export const revalidate = 20

const title = 'My reading list'
const description = 'Read to know we are not alone and our knowledge is limited.'

export const metadata = getMetadata({
  title,
  description,
  images: [`/api/og?title=${encodeURI(title)}&description=${encodeURI(description)}`]
})

export default async function ReadingHomePage() {
  const { books } = await getUnofficialBooks()

  // Make "isReading" book always at the beginning
  books.sort((a, b) => (a.isReading === b.isReading ? 0 : a.isReading ? -1 : 1))

  // all uniq tags from current books
  const tags: string[] = Array.from(new Set(books.flatMap((book: Book) => book.tags)))

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
        icon={{ staticImageData: ReadingIcon }}
        iconClassName="h-12 w-12"
        number={books.length}
      />
      <Container className={cn('shrink-0 grow basis-auto', bodyPadding)}>
        <Suspense fallback={<SkeletonReadingContainer />}>
          <ReadingPage books={books} tags={tags} />
        </Suspense>
      </Container>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

function SkeletonReadingContainer() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-start">
        <div className="flex gap-x-2 gap-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-6 w-20 animate-pulse rounded-md bg-white"></div>
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
