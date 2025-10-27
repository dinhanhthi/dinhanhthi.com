import { getPosts } from '@/src/lib/fetcher'
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
      pageSize: 1000 // Get all posts
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

    // Extract unique tags and generate tag URLs
    const allTags = posts.flatMap(post => post.tags || [])
    const uniqueTagSlugs = [...new Set(allTags.map(tag => tag.slug).filter(Boolean))]

    const tagUrls: MetadataRoute.Sitemap = uniqueTagSlugs.map(slug => ({
      url: `${baseUrl}/tag/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6
    }))

    // Blog pages URLs (categorized by tags)
    const blogUrls: MetadataRoute.Sitemap = uniqueTagSlugs.map(slug => ({
      url: `${baseUrl}/blogs/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6
    }))

    // Add main blog page
    blogUrls.push({
      url: `${baseUrl}/blogs`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8
    })

    return [...staticPages, ...postUrls, ...tagUrls, ...blogUrls]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return at least static pages if fetching posts fails
    return staticPages
  }
}
