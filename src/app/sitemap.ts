import { getPosts, getTopics } from '@/src/lib/fetcher'
import { getUri } from '@/src/lib/helpers'
import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

/**
 * Generate dynamic sitemap for the website
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_DOMAIN
  const currentDate = new Date()

  if (!baseUrl) {
    return []
  }

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/notes`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/reading`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7
    }
  ]

  try {
    // Fetch all published posts from Notion
    const posts = await getPosts({
      filter: {
        and: [
          {
            property: process.env.NEXT_PUBLIC_ID_PUBLISHED || 'published',
            checkbox: {
              equals: true
            }
          }
        ]
      },
      pageSize: 1000, // Get all posts
      whoIsCalling: 'sitemap.ts/sitemap/getAllPublishedPosts'
    })

    // Generate URLs for all posts
    const postUrls: MetadataRoute.Sitemap = posts
      .filter(post => post.slug) // Filter out posts without slug
      .map(post => ({
        url: `${baseUrl}${getUri('note', post.slug)}`,
        lastModified: post.date ? new Date(post.date) : currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.7
      }))

    // Tag pagination URLs
    const numPostsPerPageTag = 48
    const tags = await getTopics({ whoIsCalling: 'sitemap.ts' })
    const tagUrls: MetadataRoute.Sitemap = []

    for (const tag of tags) {
      const allPostsForTag = await getPosts({
        filter: {
          property: 'tags',
          multi_select: {
            contains: tag?.name
          }
        },
        whoIsCalling: `sitemap.ts/sitemap/getPostsForTag/${tag.name}`
      })
      const numPosts = allPostsForTag?.length || 0
      const totalPages = Math.ceil(numPosts / numPostsPerPageTag)

      // Generate URLs for all pagination pages of this tag
      for (let i = 1; i <= totalPages; i++) {
        const url = i === 1 ? `${baseUrl}/tag/${tag.slug}` : `${baseUrl}/tag/${tag.slug}/page/${i}`

        tagUrls.push({
          url,
          lastModified: currentDate,
          changeFrequency: 'weekly' as const,
          priority: i === 1 ? 0.6 : 0.5
        })
      }
    }

    // Blog pagination URLs
    const numPostsPerPage = 24
    const allBlogs = await getPosts({
      filter: {
        property: 'blog',
        checkbox: {
          equals: true
        }
      },
      whoIsCalling: 'sitemap.ts/sitemap/getAllBlogs'
    })
    const numBlogs = allBlogs?.length || 0
    const totalPages = Math.ceil(numBlogs / numPostsPerPage)

    const blogUrls: MetadataRoute.Sitemap = []

    // Generate URLs for all blog pagination pages
    for (let i = 1; i <= totalPages; i++) {
      const url = i === 1 ? `${baseUrl}/blogs` : `${baseUrl}/blogs/page/${i}`

      blogUrls.push({
        url,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: i === 1 ? 0.8 : 0.7
      })
    }

    return [...staticPages, ...postUrls, ...tagUrls, ...blogUrls]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return at least static pages if fetching posts fails
    return staticPages
  }
}
