import { getUnofficialBooks } from '@/src/lib/fetcher'
import { getMetadata } from '@/src/lib/helpers'
import { Book } from '@/src/lib/types'
import Link from 'next/link'
import { Suspense } from 'react'
import Container from '../../components/Container'
import HeaderPage from '../../components/HeaderPage'
import ReadingPage, { SkeletonReadingPage } from './ReadingPage'

export const dynamic = 'force-dynamic'
export const revalidate = 60

const title = 'My reading list'
const description = 'Read to know we are not alone and our knowledge is limited.'

export const metadata = getMetadata({
  title,
  description,
  images: [`/api/og?title=${encodeURI(title)}&description=${encodeURI(description)}`]
})

export default async function ReadingHomePage() {
  const { books } = await getUnofficialBooks({
    whoIsCalling: '(single-page)/reading/page.tsx/ReadingHomePage'
  })
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
            <Link className="text-link hover:text-link-hover" href="/note/my-taste-of-reading/">
              my taste of reading
            </Link>
            , my{' '}
            <a
              className="text-link hover:text-link-hover"
              href="https://www.goodreads.com/review/list/19630622-thi-dinh?ref=nav_mybooks&shelf=to-read"
              target="_blank"
            >
              want-to-read list
            </a>{' '}
            and{' '}
            <a
              className="text-link hover:text-link-hover"
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
      <Container>
        <Suspense fallback={<SkeletonReadingPage />}>
          <ReadingPage books={books} tags={tags} />
        </Suspense>
      </Container>
    </>
  )
}
