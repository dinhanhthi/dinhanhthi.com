import BlogsIcon from '@/public/blogs.svg'
import { OptionalCatchAllParams, OptionalCatchAllProps } from '@notion-x/src/interface'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getPosts } from '../../../lib/fetcher'
import PageOfPostsListTemplate, {
  PageOfPostsListTemplateProps
} from '../../../templates/PageOfPostsListTemplate'

export const revalidate = 20

const numPostsPerPage = 24

const description =
  'A list of blog posts that I have written. These blogs are not personal notes, but rather intended for you, the reader.'

export async function generateMetadata({ params }: OptionalCatchAllProps): Promise<Metadata> {
  const currentPage = +(params?.slug?.[1] || 1)
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

export default async function BlogsHomePage({ params }: OptionalCatchAllProps) {
  const currentPage = +(params?.slug?.[1] || 1)

  if (
    !params ||
    (params.slug?.length > 0 && params.slug?.[0] !== 'page') ||
    params.slug?.length > 2
  ) {
    notFound()
  }

  console.log(`\n👉 uri: /blogs/page/${currentPage}/`)

  const notRootPage = !!params.slug

  const allBlogs = await getPosts({
    filter: {
      property: 'blog',
      checkbox: {
        equals: true
      }
    }
  })
  const numBlogs = allBlogs?.length || 0
  const totalPages = Math.ceil(numBlogs / numPostsPerPage)

  if (notRootPage && currentPage === 1) {
    redirect(`/blogs/`)
  }

  if (currentPage !== 1 && currentPage > totalPages) {
    notFound()
  }

  const postsOnThisPage = !allBlogs.length
    ? []
    : allBlogs.slice(numPostsPerPage * (currentPage - 1), numPostsPerPage * currentPage)

  return (
    <PageOfPostsListTemplate
      object={
        {
          name: 'Blog posts',
          subtitle: description,
          icon: { staticImageData: BlogsIcon },
          uri: 'blog'
        } as PageOfPostsListTemplateProps['object']
      }
      posts={postsOnThisPage}
      pinnedPosts={[]}
      totalPages={totalPages}
      currentPage={currentPage}
      postType="PostCardWave"
      postListContainerClassName="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8 sm:gap-x-4"
    />
  )
}
