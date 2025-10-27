import { MetadataRoute } from 'next'

/**
 * Generate robots.txt file
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_DOMAIN

  if (!baseUrl) {
    return {
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/api/', '/_next/', '/static/']
        }
      ]
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/static/']
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  }
}
