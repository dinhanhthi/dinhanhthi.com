import { Suspense } from 'react'

import { getUnofficialBooks } from '@/src/lib/fetcher'
import { getMetadata } from '@/src/lib/helpers'
import { Book } from '@/src/lib/types'
import Link from 'next/link'
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
  books.sort((a, b) => (a.isReading === b.isReading ? 0 : a.isReading ? -1 : 1))
  const tags: string[] = Array.from(new Set(books.flatMap((book: Book) => book.tags)))
  tags.sort()
  tags.sort((a, b) => (a === 'favorite' ? -1 : b === 'favorite' ? 1 : 0))

  return (
    <>
      <HeaderPage
        title={title}
        subtitle={
          <>
            {description} Read more about{' '}
            <Link className="m2it-link" href="/note/my-taste-of-reading/">
              my taste of reading
            </Link>
            , my{' '}
            <a
              className="m2it-link"
              href="https://www.goodreads.com/review/list/19630622-thi-dinh?ref=nav_mybooks&shelf=to-read"
              target="_blank"
            >
              want-to-read list
            </a>{' '}
            and{' '}
            <a
              className="m2it-link"
              href="https://www.goodreads.com/review/list/19630622-thi-dinh?shelf=read"
              target="_blank"
            >
              reviews
            </a>{' '}
            on Goodreads.
          </>
        }
        iconPath="/logo_sketches/sketch_reading_nobg.png"
        number={books.length}
      />
      <Suspense fallback={<SkeletonReadingContainer />}>
        <ReadingPage books={books} tags={tags} />
      </Suspense>
    </>
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
