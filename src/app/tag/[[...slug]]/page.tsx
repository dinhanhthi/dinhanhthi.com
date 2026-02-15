import PageOfPostsListTemplate, {
  PageOfPostsListTemplateProps
} from '@/src/app/templates/PageOfPostsListTemplate'
import { getPosts, getTopics } from '@/src/lib/fetcher'
import {
  filterDupLangPosts,
  generateMetaTitle,
  getMetadata,
  getStartCursorForCurrentPage,
  getUri
} from '@/src/lib/helpers'
import { queryDefinitions } from '@/src/lib/query-definitions'
import { OptionalCatchAllProps, Post, Tag } from '@/src/lib/types'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { defaultBlurDataURL } from '@/src/lib/config'

export const revalidate = 120

const numPostsPerPage = 48
const numBlogPosts = 4

export async function generateMetadata({ params }: OptionalCatchAllProps): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug[0] || ''
  const currentPage = +(resolvedParams?.slug?.[2] || 1)
  console.debug(`\n👉 slug:  ${slug}, currentPage: ${currentPage}\n`)
  const tags = await getTopics({
    whoIsCalling: `tag/[[...slug]]/page.tsx/generateMetadata (slug: ${slug})`
  })
  const tag = getTag(slug, tags)
  if (!tag)
    return {
      title: generateMetaTitle('Cannot find this tag!')
    }
  const [totalPages] = await getTotalPages(tag)
  const title =
    totalPages > 1 ? `Topic "${tag?.name}" - Page ${currentPage}` : `Topic "${tag?.name}"`

  return getMetadata({
    title,
    images: [`/api/og?title=${encodeURI(title)}`]
  })
}

export default async function TagPage({ params }: OptionalCatchAllProps) {
  const resolvedParams = await params
  const currentPage = +(resolvedParams?.slug?.[2] || 1)

  if (
    !resolvedParams ||
    !resolvedParams?.slug ||
    (resolvedParams.slug.length > 1 && resolvedParams.slug[1] !== 'page') ||
    resolvedParams.slug.length > 3
  ) {
    notFound()
  }

  const notRootPage = resolvedParams.slug.length > 1
  const slug = resolvedParams.slug[0] || ''

  console.log(`\n👉 uri: /tag/${slug}/page/${currentPage}/`)

  const _tags = await getTopics({
    whoIsCalling: `tag/[[...slug]]/page.tsx/TagPage (slug: ${slug})`,
    uri: `https://dinhanhthi.com/tag/${slug}/page/${currentPage}/`
  })
  const tags = _tags.map(tag => ({
    ...tag,
    icon: { sourceUrl: tag.iconUrl, width: 60, height: 60, blurDataURL: defaultBlurDataURL }
  }))

  const tag = getTag(slug, tags)
  if (!tag) notFound()

  const [totalPages, allPosts] = await getTotalPages(tag)

  if (notRootPage && currentPage === 1) {
    redirect(getUri('tag', slug)!)
  }

  if (currentPage !== 1 && currentPage > totalPages) {
    notFound()
  }

  const startCursor = getStartCursorForCurrentPage(currentPage, allPosts, numPostsPerPage)
  const _postsOnThisPage = !allPosts.length
    ? []
    : await getPosts({
        ...queryDefinitions.tagPage.regularPostsByTag(tag.name),
        startCursor,
        whoIsCalling: `tag/[[...slug]]/page.tsx/TagPage/getPostsOnThisPage (slug: ${slug})`,
        uri: `https://dinhanhthi.com/tag/${slug}/page/${currentPage}/`
      })

  const postsOnThisPage = filterDupLangPosts(_postsOnThisPage).slice(0, numPostsPerPage)

  const _blogPosts = await getPosts({
    ...queryDefinitions.tagPage.blogPostsByTag(tag.name),
    whoIsCalling: `tag/[[...slug]]/page.tsx/TagPage/getBlogPosts (slug: ${slug})`,
    uri: `https://dinhanhthi.com/tag/${slug}/page/${currentPage}/`
  })
  const blogPosts = filterDupLangPosts(_blogPosts).slice(0, numBlogPosts)

  return (
    <PageOfPostsListTemplate
      object={tag as PageOfPostsListTemplateProps['object']}
      posts={postsOnThisPage.filter(post => !post.pinned)}
      blogPosts={blogPosts}
      pinnedPosts={postsOnThisPage.filter(post => post.pinned)}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  )
}

async function getTotalPages(tag: Tag): Promise<[number, Post[]]> {
  const allPosts = await getPosts({
    ...queryDefinitions.tagPage.allPostsByTag(tag.name),
    whoIsCalling: `tag/[[...slug]]/page.tsx/getTotalPages (slug: ${tag.slug})`,
    uri: `https://dinhanhthi.com/tag/${tag.slug}/`
  })
  const numPosts = allPosts?.length || 0
  const totalPages = Math.ceil(numPosts / numPostsPerPage)
  return [totalPages, allPosts]
}

function getTag(slug: string, tags: Tag[]) {
  return tags.find(t => t.slug === slug || t.slug === slug.replace(/%26/g, '&'))
}
