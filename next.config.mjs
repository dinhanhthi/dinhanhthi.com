const nextConfig = {
  output: 'export', // full static site in out/ (deployed to GitHub Pages)
  trailingSlash: true, // use "/about/" instead of "/about"
  poweredByHeader: false, // remove "Powered by Next.js" from the header
  staticPageGenerationTimeout: 600, // 10 min for Notion API during full static build
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
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react', 'lodash']
  },
  images: {
    unoptimized: true, // no image optimization server on a static host
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
