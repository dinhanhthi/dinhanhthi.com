import { postSimpleListContainerClass } from '@/src/lib/config'
import { getPosts } from '@/src/lib/fetcher'
import { filterDupLangPosts } from '@/src/lib/helpers'
import { OptionalCatchAllParams, OptionalCatchAllProps } from '@/src/lib/types'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import PageOfPostsListTemplate, {
  PageOfPostsListTemplateProps
} from '../../../templates/PageOfPostsListTemplate'

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

  const _allBlogs = await getPosts({
    filter: {
      property: 'blog',
      checkbox: {
        equals: true
      }
    }
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

  const postsOnThisPage = !allBlogs.length
    ? []
    : allBlogs.slice(numPostsPerPage * (currentPage - 1), numPostsPerPage * currentPage)

  return (
    <PageOfPostsListTemplate
      object={
        {
          name: 'Blog posts',
          subtitle: description,
          iconPath: '/logo_sketches/sketch_blog_nobg.png',
          uri: 'blog'
        } as PageOfPostsListTemplateProps['object']
      }
      posts={postsOnThisPage}
      pinnedPosts={[]}
      totalPages={totalPages}
      currentPage={currentPage}
      postType="PostBlogSimple"
      postListContainerClassName={postSimpleListContainerClass}
    />
  )
}
