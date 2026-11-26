import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

/**
 * Generate robots.txt file
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  // NEXT_PUBLIC_SITE_DOMAIN is a bare domain (e.g. "dinhanhthi.com"), without scheme
  const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN
  const baseUrl = domain && `https://${domain}`

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
