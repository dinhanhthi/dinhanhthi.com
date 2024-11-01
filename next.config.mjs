const nextConfig = {
  // output: 'export',
  trailingSlash: true, // use "/about/" instead of "/about" (not supported yet by --turbo)
  poweredByHeader: false, // remove "Powered by Next.js" from the header
  // transpilePackages: ['react-syntax-highlighter'],
  experimental: {
    scrollRestoration: true, // not supported yet by --turbo,
    esmExternals: false
    // serverActions: true
    // esmExternals: 'loose' // https://nextjs.org/docs/messages/import-esm-externals
  },
  staticPageGenerationTimeout: 180, // seconds
  modularizeImports: {
    lodash: {
      transform: 'lodash/{{member}}',
      preventFullImport: true
    }
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
    // unoptimized: true,
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
  // redirects: async () => {
  //   return [
  //     // {
  //     //   source: '/:slug',
  //     //   destination: '/note/:slug',
  //     //   permanent: true
  //     // }
  //     {
  //       source: '/:slug(^(?!notes$|tags$|about$|projects$|tools$|bookmarks$|support-me$).*)',
  //       destination: '/note/:slug',
  //       permanent: true
  //     }
  //   ]
  // }
}

export default nextConfig
