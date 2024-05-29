import ReadingIcon from '@/public/reading.svg'
import cn from 'classnames'
import { Suspense } from 'react'

import ScrollToTop from '@notion-x/src/components/ScrollToTop'
import { Book } from '../../../interface'
import Container from '../../components/Container'
import Footer from '../../components/Footer'
import HeaderPage from '../../components/HeaderPage'
import { SkeletonSearchBar } from '../../components/SkeletonSearchBar'
import { bodyPadding, containerWide } from '../../lib/config'
import { getUnofficialBooks } from '../../lib/fetcher'
import { getMetadata } from '../../lib/helpers'
import { SkeletonToolItem } from '../tools/ToolsPage'
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
  const tags: string[] = Array.from(new Set(books.flatMap((book: Book) => book.tag)))

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
      <Container className={cn('basis-auto grow shrink-0', bodyPadding, containerWide)}>
        <Suspense fallback={<SkeletonReadingContainer />}>
          <ReadingPage books={books} tags={tags} />
        </Suspense>
      </Container>
      <Footer footerType="gray" />
      <ScrollToTop />
    </div>
  )
}

function SkeletonReadingContainer() {
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
