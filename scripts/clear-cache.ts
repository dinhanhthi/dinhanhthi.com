#!/usr/bin/env tsx

/**
 * Cache Clearing Script
 *
 * This script clears Redis cache for specific keys or entire namespaces.
 * Useful when you need to force fresh data fetches.
 *
 * Usage:
 *   # Clear specific cache
 *   pnpm run clear-cache --key=topics
 *
 *   # Clear all cache in notion namespace
 *   pnpm run clear-cache --all
 *
 * Or with tsx directly:
 *   npx tsx scripts/clear-cache.ts --all
 */

import { clearNamespace, invalidateCache } from '@/src/lib/redis-cache'

async function main() {
  const args = process.argv.slice(2)
  const clearAll = args.includes('--all')
  const keyArg = args.find(arg => arg.startsWith('--key='))
  const key = keyArg?.split('=')[1]

  console.log('🗑️  Cache Clearing Script\n')

  if (clearAll) {
    console.log('⚠️  Clearing ALL cache in "notion" namespace...')
    const count = await clearNamespace('notion')

    if (count > 0) {
      console.log(`✅ Successfully cleared ${count} cache entries`)
    } else {
      console.log('ℹ️  No cache entries found to clear')
    }
  } else if (key) {
    console.log(`🔍 Clearing cache for key: ${key}`)
    await invalidateCache(key, { namespace: 'notion' })
    console.log(`✅ Cache cleared for: notion:${key}`)
  } else {
    console.log('❌ Please specify what to clear:\n')
    console.log('Available options:')
    console.log('  --all              Clear all cache in "notion" namespace')
    console.log('  --key=<key>        Clear specific cache key\n')
    console.log('Examples:')
    console.log('  pnpm run clear-cache --all')
    console.log('  pnpm run clear-cache --key=topics')
    console.log('  pnpm run clear-cache --key=unofficial-posts')
    process.exit(1)
  }
}

main().catch(error => {
  console.error('💥 Error clearing cache:', error)
  process.exit(1)
})
