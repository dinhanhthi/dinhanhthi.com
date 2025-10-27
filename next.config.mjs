const nextConfig = {
  trailingSlash: true, // use "/about/" instead of "/about"
  poweredByHeader: false, // remove "Powered by Next.js" from the header
  staticPageGenerationTimeout: 180, // seconds
  logging: {
    fetches: {
      fullUrl: false // Reduce verbose logging for fetch requests
    }
  },
  modularizeImports: {
    lodash: {
      transform: 'lodash/{{member}}',
      preventFullImport: true
    }
  },
  sassOptions: {
    silenceDeprecations: ['legacy-js-api']
  },
  headers: async () => {
    const headers = []
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
      headers.push({
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex'
          }
        ],
        source: '/:path*'
      })
    }
    return headers
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.gravatar.com'
      },
      {
        protocol: 'https',
        hostname: '**.math2it.com'
      },
      {
        protocol: 'https',
        hostname: '**.imgur.com'
      },
      {
        protocol: 'https',
        hostname: '**.dinhanhthi.com'
      },
      {
        protocol: 'https',
        hostname: '**.notion.so'
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com'
      }
    ]
  }
}

export default nextConfig
