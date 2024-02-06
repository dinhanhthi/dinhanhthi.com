import { getPosts, getTopics } from '@/src/app/lib/fetcher'
import { generateMetaTitle, getMetadata, getUri } from '@/src/app/lib/helpers'
import PageOfPostsListTemplate, {
  PageOfPostsListTemplateProps
} from '@/src/app/templates/PageOfPostsListTemplate'
import { OptionalCatchAllParams, OptionalCatchAllProps, Post, Tag } from '@notion-x/src/interface'
import { getStartCursorForCurrentPage } from '@notion-x/src/lib/helpers'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { defaultBlurDataURL } from '../../lib/config'

export const revalidate = 20

const numPostsPerPage = 48

export async function generateMetadata({ params }: OptionalCatchAllProps): Promise<Metadata> {
  const slug = params.slug[0] || ''
  const currentPage = +(params?.slug?.[2] || 1)
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
  const currentPage = +(params?.slug?.[2] || 1)

  if (
    !params ||
    !params?.slug ||
    (params.slug.length > 1 && params.slug[1] !== 'page') ||
    params.slug.length > 3
  ) {
    notFound()
  }

  const notRootPage = params.slug.length > 1
  const slug = params.slug[0] || ''

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
  const postsOnThisPage = !allPosts.length
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
        pageSize: numPostsPerPage
      })

  const blogPosts = await getPosts({
    pageSize: 4,
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
