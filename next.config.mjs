const nextConfig = {
  output: 'export',
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
    unoptimized: true
  }
}

export default nextConfig
