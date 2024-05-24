import BookmarksIcon from '@/public/bookmarks.png'
import cn from 'classnames'
import { Suspense } from 'react'

import ScrollToTop from '@notion-x/src/components/ScrollToTop'
import Container from '../../components/Container'
import Footer from '../../components/Footer'
import HeaderPage from '../../components/HeaderPage'
import { SkeletonSearchBar } from '../../components/SkeletonSearchBar'
import { bodyPadding, containerWide } from '../../lib/config'
import { getUnofficialBookmarks } from '../../lib/fetcher'
import { getMetadata } from '../../lib/helpers'
import { SkeletonBookmarkItemSimpleTemplate } from './BookmarkItemSimpleTemplate'
import BookmarksPageTemplate from './BookmarksPageTemplate'

export const revalidate = 20

const title = 'My bookmarks'
const description = 'A collection of links to articles, videos, and other resources I find useful.'

export const metadata = getMetadata({
  title,
  description,
  images: [`/api/og?title=${encodeURI(title)}&description=${encodeURI(description)}`]
})

export default async function BookmarksPage() {
  const { bookmarks, tags } = await getUnofficialBookmarks()

  // Make "others" tag always at the end
  const othersIndex = tags.findIndex(tag => tag === 'others')
  if (othersIndex !== -1) {
    tags.push(tags.splice(othersIndex, 1)[0])
  }

  // Add "favorite" tag to the first
  tags.unshift('favorite')

  // Make bookmarks whose pinned is true always at the beginning
  bookmarks.sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1))

  return (
    <div className="thi-bg-stone flex flex-col">
      <HeaderPage
        childrenContainerClassName="w-full"
        headerType="gray"
        title={title}
        subtitle={description}
        headerWidth="wide"
        icon={{ staticImageData: BookmarksIcon }}
        iconClassName="h-12 w-12"
      />
      <Container className={cn('basis-auto grow shrink-0 z-0', bodyPadding, containerWide)}>
        <Suspense fallback={<SkeletonBookmarkContainer />}>
          <BookmarksPageTemplate bookmarks={bookmarks} tags={tags}></BookmarksPageTemplate>
        </Suspense>
      </Container>
      <Footer footerType="gray" />
      <ScrollToTop />
    </div>
  )
}

function SkeletonBookmarkContainer() {
  return (
    <div className="flex flex-col gap-8">
      <SkeletonSearchBar placeholder="Search bookmarks..." />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBookmarkItemSimpleTemplate index={i} key={i} />
        ))}
      </div>
    </div>
  )
}
