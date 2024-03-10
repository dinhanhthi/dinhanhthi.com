import BookmarksIcon from '@/public/bookmarks.png'
import { OptionalCatchAllParams, OptionalCatchAllProps } from '@notion-x/src/interface'
import cn from 'classnames'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'

import ScrollToTop from '@notion-x/src/components/ScrollToTop'
import Container from '../../../components/Container'
import Footer from '../../../components/Footer'
import HeaderPage from '../../../components/HeaderPage'
import { SkeletonSearchBar } from '../../../components/SkeletonSearchBar'
import { bodyPadding, containerWide } from '../../../lib/config'
import { getUnofficialBookmarks } from '../../../lib/fetcher'
import { SkeletonBookmarkItemSimpleTemplate } from '../BookmarkItemSimpleTemplate'
import BookmarksPageTemplate from '../BookmarksPageTemplate'

const marksPerPage = 100

export const revalidate = 20

export async function generateMetadata({ params }: OptionalCatchAllProps): Promise<Metadata> {
  const currentPage = +(params?.slug?.[1] || 1)
  const title = currentPage === 1 ? 'My bookmarks' : `My bookmarks - page ${currentPage}`
  const description =
    'A collection of links to articles, videos, and other resources I find useful.'
  return {
    title,
    description,
    openGraph: {
      images: [`/api/og?title=${encodeURI(title)}&description=${encodeURI(description)}`]
    }
  }
}

export async function generateStaticParams() {
  const params = [] as OptionalCatchAllParams[]
  const allMarks = await getUnofficialBookmarks()
  const numMarks = allMarks?.length || 0
  const totalPages = Math.ceil(numMarks / marksPerPage)
  for (let i = 1; i <= totalPages; i++) {
    const path = i === 1 ? { slug: [] } : { slug: ['page', i.toString()] }
    params.push(path)
  }
  return params
}

export default async function BookmarksPage({ params }: OptionalCatchAllProps) {
  const currentPage = +(params?.slug?.[1] || 1)

  if (
    !params ||
    (params.slug?.length > 0 && params.slug?.[0] !== 'page') ||
    params.slug?.length > 2
  ) {
    notFound()
  }

  console.log(`\n👉 uri: /bookmarks/page/${currentPage}/`)

  const notRootPage = !!params.slug

  const allMarks = await getUnofficialBookmarks()
  const numMarks = allMarks?.length || 0
  const totalPages = Math.ceil(numMarks / marksPerPage)

  if (notRootPage && currentPage === 1) {
    redirect(`/bookmarks/`)
  }

  if (currentPage !== 1 && currentPage > totalPages) {
    notFound()
  }

  const marksOnThisPage = !allMarks.length
    ? []
    : allMarks.slice(marksPerPage * (currentPage - 1), marksPerPage * currentPage)

  return (
    <div className="thi-bg-stone flex flex-col">
      <HeaderPage
        childrenContainerClassName="w-full"
        headerType="gray"
        title="My bookmarks"
        subtitle={`A collection of links to articles, videos, and other resources I find useful.`}
        headerWidth="wide"
        icon={{ staticImageData: BookmarksIcon }}
        iconClassName="h-12 w-12"
      />
      <Container className={cn('basis-auto grow shrink-0 z-0', bodyPadding, containerWide)}>
        <Suspense fallback={<SkeletonBookmarkContainer />}>
          <BookmarksPageTemplate
            totalPages={totalPages}
            currentPage={currentPage}
            bookmarks={marksOnThisPage}
            startIndex={(currentPage - 1) * marksPerPage}
          ></BookmarksPageTemplate>
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
        {Array.from({ length: marksPerPage }).map((_, i) => (
          <SkeletonBookmarkItemSimpleTemplate index={i} key={i} />
        ))}
      </div>
    </div>
  )
}
