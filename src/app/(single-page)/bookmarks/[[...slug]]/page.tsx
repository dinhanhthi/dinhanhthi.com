import BookmarksIcon from '@/public/bookmarks.png'
import { OptionalCatchAllParams, OptionalCatchAllProps } from '@notion-x/src/interface'
import { getStartCursorForCurrentPage } from '@notion-x/src/lib/helpers'
import cn from 'classnames'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'

import Container from '../../../components/Container'
import Footer from '../../../components/Footer'
import HeaderPage from '../../../components/HeaderPage'
import { bodyPadding, containerWide } from '../../../lib/config'
import { getBookmarks } from '../../../lib/fetcher'
import { SkeletonToolItem } from '../../tools/ToolsPage'
import BookmarksPageTemplate from '../BookmarksPageTemplate'

const marksPerPage = 24

export const revalidate = 20

export async function generateMetadata({ params }: OptionalCatchAllProps): Promise<Metadata> {
  const currentPage = +(params?.slug?.[1] || 1)
  return {
    title: `My bookmarks - page ${currentPage} | Thi`,
    description: 'A collection of links to articles, videos, and other resources I find useful.'
  }
}

export async function generateStaticParams() {
  const params = [] as OptionalCatchAllParams[]
  const allMarks = await getBookmarks({})
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

  const allMarks = await getBookmarks({})
  const numMarks = allMarks?.length || 0
  const totalPages = Math.ceil(numMarks / marksPerPage)

  if (notRootPage && currentPage === 1) {
    redirect(`/bookmarks/`)
  }

  if (currentPage !== 1 && currentPage > totalPages) {
    notFound()
  }

  const startCursor = getStartCursorForCurrentPage(currentPage, allMarks, marksPerPage)
  const marksOnThisPage = !allMarks.length
    ? []
    : await getBookmarks({ startCursor, pageSize: marksPerPage })

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
      <Container className={cn('basis-auto grow shrink-0', bodyPadding, containerWide)}>
        <Suspense fallback={<SkeletonToolContainer />}>
          <BookmarksPageTemplate
            totalPages={totalPages}
            currentPage={currentPage}
            bookmarks={marksOnThisPage}
          ></BookmarksPageTemplate>
        </Suspense>
      </Container>
      <Footer footerType="gray" />
    </div>
  )
}

function SkeletonToolContainer() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex items-center gap-x-4 gap-y-2 flex-wrap justify-center sm:justify-start">
        <div className="text-slate-600 whitespace-nowrap">Show only?</div>
        <div className="flex gap-x-2 gap-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={cn('h-6 w-20 bg-white rounded-md animate-pulse')}></div>
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
