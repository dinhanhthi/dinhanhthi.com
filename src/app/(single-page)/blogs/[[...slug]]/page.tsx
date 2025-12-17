import { Suspense } from 'react'

import Container from '@/src/app/components/Container'
import HeaderPage from '@/src/app/components/HeaderPage'
import Pagination from '@/src/app/components/Pagination'
import PostList, { SkeletonPostList } from '@/src/app/components/PostsList'
import { defaultPostTypeOpts, postSimpleListContainerClass } from '@/src/lib/config'
import { getPosts } from '@/src/lib/fetcher'
import { filterDupLangPosts } from '@/src/lib/helpers'
import { queryDefinitions } from '@/src/lib/query-definitions'
import { OptionalCatchAllParams, OptionalCatchAllProps } from '@/src/lib/types'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

export const revalidate = 60

const numPostsPerPage = 24

const description =
  'A list of blog posts that I have written. These blogs are not personal notes, but rather intended for you, the reader.'

export async function generateMetadata({ params }: OptionalCatchAllProps): Promise<Metadata> {
  const resolvedParams = await params
  const currentPage = +(resolvedParams?.slug?.[1] || 1)
  const title = currentPage === 1 ? 'Blog posts' : `Blog posts - page ${currentPage}`
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
  const allblogs = await getPosts({
    filter: {
      property: 'blog',
      checkbox: {
        equals: true
      }
    }
  })
  const numBlogs = allblogs?.length || 0
  const totalPages = Math.ceil(numBlogs / numPostsPerPage)
  for (let i = 1; i <= totalPages; i++) {
    const path = i === 1 ? { slug: [] } : { slug: ['page', i.toString()] }
    params.push(path)
  }
  return params
}

// Async component for blog posts content
async function BlogPostsContent({ currentPage }: { currentPage: number }) {
  const _allBlogs = await getPosts({
    ...queryDefinitions.blogsPage.allBlogs,
    whoIsCalling: `(single-page)/blogs/[[...slug]]/page.tsx/BlogPostsContent (currentPage: ${currentPage})`,
    uri: 'https://dinhanhthi.com/blogs/page/${currentPage}/'
  })
  const allBlogs = filterDupLangPosts(_allBlogs)
  const postsOnThisPage = !allBlogs.length
    ? []
    : allBlogs.slice(numPostsPerPage * (currentPage - 1), numPostsPerPage * currentPage)

  if (postsOnThisPage.length === 0) {
    return <div className="my-4 text-xl">There is no post yet!</div>
  }

  return (
    <div className="overflow-hidden">
      <PostList
        posts={postsOnThisPage}
        postType="PostBlogSimple"
        postTypeOpts={defaultPostTypeOpts}
        options={{
          className: postSimpleListContainerClass
        }}
      />
    </div>
  )
}

export default async function BlogsHomePage({ params }: OptionalCatchAllProps) {
  const resolvedParams = await params
  const currentPage = +(resolvedParams?.slug?.[1] || 1)

  if (
    !resolvedParams ||
    (resolvedParams.slug?.length > 0 && resolvedParams.slug?.[0] !== 'page') ||
    resolvedParams.slug?.length > 2
  ) {
    notFound()
  }

  console.log(`\n👉 uri: /blogs/page/${currentPage}/`)

  const notRootPage = !!resolvedParams.slug

  // Fetch all blogs to calculate total pages (this is fast due to Redis cache)
  const _allBlogs = await getPosts({
    ...queryDefinitions.blogsPage.allBlogs,
    whoIsCalling: `(single-page)/blogs/[[...slug]]/page.tsx/BlogsHomePage/getTotalPages (currentPage: ${currentPage})`,
    uri: 'https://dinhanhthi.com/blogs/page/${currentPage}/'
  })
  const allBlogs = filterDupLangPosts(_allBlogs)
  const numBlogs = allBlogs?.length || 0
  const totalPages = Math.ceil(numBlogs / numPostsPerPage)

  if (notRootPage && currentPage === 1) {
    redirect(`/blogs/`)
  }

  if (currentPage !== 1 && currentPage > totalPages) {
    notFound()
  }

  return (
    <>
      <HeaderPage
        title="Blog posts"
        subtitle={description}
        iconPath="/logo_sketches/sketch_blog_nobg.png"
      />
      <Container>
        <Suspense
          fallback={
            <SkeletonPostList
              count={6}
              postType="PostBlogSimple"
              className={postSimpleListContainerClass}
            />
          }
        >
          <BlogPostsContent currentPage={currentPage} />
        </Suspense>

        {totalPages > 1 && (
          <Pagination
            className="my-8"
            path="blogs"
            total={totalPages}
            current={currentPage}
            pageAlias="page"
          />
        )}
      </Container>
    </>
  )
}
