#!/usr/bin/env tsx

/**
 * Cache Warming Script
 *
 * This script warms up the Redis cache by fetching all main data sources.
 * Run this after deployment to ensure cache is populated before users visit.
 *
 * Usage:
 *   pnpm run warm-cache
 *
 * Or with tsx directly:
 *   npx tsx scripts/warm-cache.ts
 */

import { getPosts, getTopics, getUnofficialBooks, getUnofficialTools } from '@/src/lib/fetcher'

async function warmCache() {
  console.log('🔥 Starting cache warming...\n')

  const startTime = Date.now()
  const results = {
    topics: 0,
    posts: 0,
    books: 0,
    tools: 0,
    errors: [] as string[]
  }

  // Warm Topics Cache
  try {
    console.log('📋 Fetching topics...')
    const topics = await getTopics()
    results.topics = topics.length
    console.log(`✅ Cached ${topics.length} topics\n`)
  } catch (error) {
    console.error('❌ Failed to cache topics:', error)
    results.errors.push('topics')
  }

  // Warm Posts Cache (first 100)
  try {
    console.log('📝 Fetching posts...')
    const posts = await getPosts({ pageSize: 100 })
    results.posts = posts.length
    console.log(`✅ Cached ${posts.length} posts\n`)
  } catch (error) {
    console.error('❌ Failed to cache posts:', error)
    results.errors.push('posts')
  }

  // Warm Books Cache
  try {
    console.log('📚 Fetching books...')
    const { books } = await getUnofficialBooks()
    results.books = books.length
    console.log(`✅ Cached ${books.length} books\n`)
  } catch (error) {
    console.error('❌ Failed to cache books:', error)
    results.errors.push('books')
  }

  // Warm Tools Cache
  try {
    console.log('🛠️  Fetching tools...')
    const { tools } = await getUnofficialTools()
    results.tools = tools.length
    console.log(`✅ Cached ${tools.length} tools\n`)
  } catch (error) {
    console.error('❌ Failed to cache tools:', error)
    results.errors.push('tools')
  }

  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log('─'.repeat(50))
  console.log('📊 Cache Warming Summary:')
  console.log('─'.repeat(50))
  console.log(`⏱️  Duration: ${duration}s`)
  console.log(`📋 Topics: ${results.topics}`)
  console.log(`📝 Posts: ${results.posts}`)
  console.log(`📚 Books: ${results.books}`)
  console.log(`🛠️  Tools: ${results.tools}`)
  console.log(
    `📦 Total items cached: ${results.topics + results.posts + results.books + results.tools}`
  )

  if (results.errors.length > 0) {
    console.log(`\n⚠️  Errors occurred for: ${results.errors.join(', ')}`)
    process.exit(1)
  } else {
    console.log('\n✅ Cache warming completed successfully!')
    process.exit(0)
  }
}

// Run the script
warmCache().catch(error => {
  console.error('💥 Unexpected error during cache warming:', error)
  process.exit(1)
})
