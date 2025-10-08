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
import { OptionalCatchAllParams, OptionalCatchAllProps, Post, Tag } from '@/src/lib/types'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { defaultBlurDataURL } from '@/src/lib/config'

export const revalidate = 20

const numPostsPerPage = 48
const numBlogPosts = 4

export async function generateMetadata({ params }: OptionalCatchAllProps): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug[0] || ''
  const currentPage = +(resolvedParams?.slug?.[2] || 1)
  console.debug(`\n👉 slug:  ${slug}, currentPage: ${currentPage}\n`)
  const [totalPages] = await getTotalPages({ slug } as Tag)
  const tags = await getTopics()
  const tag = getTag(slug, tags)
  if (!tag)
    return {
      title: generateMetaTitle('Cannot find this tag!')
    }
  const title =
    totalPages > 1 ? `Topic "${tag?.name}" - Page ${currentPage}` : `Topic "${tag?.name}"`

  return getMetadata({
    title,
    images: [`/api/og?title=${encodeURI(title)}`]
  })
}

export async function generateStaticParams() {
  const tags = await getTopics()
  const params = [] as OptionalCatchAllParams[]
  for (const tag of tags) {
    const [totalPages] = await getTotalPages(tag)
    for (let i = 1; i <= totalPages; i++) {
      const path =
        i === 1
          ? { slug: [tag.slug!] }
          : {
              slug: [tag.slug!, 'page', i.toString()]
            }

      params.push(path)
    }
  }
  return params
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

  const _tags = await getTopics()
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
        filter: {
          and: [
            {
              property: 'tags',
              multi_select: {
                contains: tag?.name
              }
            },
            {
              property: 'blog',
              checkbox: {
                equals: false
              }
            }
          ]
        },
        startCursor,
        pageSize: numPostsPerPage * 2
      })

  const postsOnThisPage = filterDupLangPosts(_postsOnThisPage).slice(0, numPostsPerPage)

  const _blogPosts = await getPosts({
    pageSize: numBlogPosts * 2,
    filter: {
      and: [
        {
          property: 'tags',
          multi_select: {
            contains: tag?.name
          }
        },
        {
          property: 'blog',
          checkbox: {
            equals: true
          }
        }
      ]
    }
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
    filter: {
      property: 'tags',
      multi_select: {
        contains: tag?.name
      }
    }
  })
  const numPosts = allPosts?.length || 0
  const totalPages = Math.ceil(numPosts / numPostsPerPage)
  return [totalPages, allPosts]
}

function getTag(slug: string, tags: Tag[]) {
  return tags.find(t => t.slug === slug || t.slug === slug.replace(/%26/g, '&'))
}
