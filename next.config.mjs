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
    domains: [
      '0.gravatar.com',
      '1.gravatar.com',
      '2.gravatar.com',
      'secure.gravatar.com',
      'math2it.com',
      'dinhanhthi.com',
      // 👇 for notion's post cover
      'images.unsplash.com',
      'notion.so',
      'www.notion.so',
      'i.imgur.com',
      'cloudinary.com',
      'res.cloudinary.com',
      's3.us-west-2.amazonaws.com'
    ],
    remotePatterns: [
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
