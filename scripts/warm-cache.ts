#!/usr/bin/env tsx

/**
 * Cache Warming Script
 *
 * This script warms up the Redis cache by fetching all main data sources.
 * Run this after deployment to ensure cache is populated before users visit.
 *
 * Usage:
 *   pnpm run warm-cache              # Normal mode: skip if cache exists
 *   pnpm run warm-cache --force      # Force mode: override all cache with fresh data
 *
 * Or with tsx directly:
 *   npx tsx scripts/warm-cache.ts
 *   npx tsx scripts/warm-cache.ts --force
 */

import {
  getPosts,
  getRecordMap,
  getTopics,
  getUnofficialBooks,
  getUnofficialTools
} from '@/src/lib/fetcher'

async function warmCache() {
  // Check if Redis cache is disabled
  if (process.env.DISABLE_REDIS_CACHE === 'true') {
    console.log('⚠️  Redis cache is disabled (DISABLE_REDIS_CACHE=true)')
    console.log('⚠️  Skipping cache warming. No action needed.\n')
    console.log('💡 To enable caching, remove DISABLE_REDIS_CACHE from your .env.local')
    process.exit(0)
  }

  // Check for force refresh flag
  const forceRefresh = process.argv.includes('--force')
  const mode = forceRefresh ? 'FORCE REFRESH' : 'NORMAL'

  console.log(`🔥 Starting cache warming (${mode} mode)...\n`)
  if (forceRefresh) {
    console.log(
      '⚡ Force refresh enabled: Will fetch latest data from Notion API and override cache\n'
    )
  } else {
    console.log('ℹ️  Normal mode: Will use existing cache if available\n')
    console.log('💡 Tip: Use --force flag to fetch fresh data from Notion API\n')
  }

  const startTime = Date.now()
  const results = {
    topics: 0,
    posts: 0,
    books: 0,
    tools: 0,
    pages: 0,
    errors: [] as string[]
  }

  // Warm Topics Cache
  try {
    console.log('📋 Fetching topics...')
    const topics = await getTopics({
      whoIsCalling: 'scripts/warm-cache.ts/warmCache/warmTopicsCache',
      forceRefresh
    })
    results.topics = topics.length
    console.log(`✅ Cached ${topics.length} topics\n`)
  } catch (error) {
    console.error('❌ Failed to cache topics:', error)
    results.errors.push('topics')
  }

  // Warm Posts Cache
  try {
    console.log('📝 Fetching posts...')

    // Query 1: Main posts (for recent notes section)
    const posts = await getPosts({
      pageSize: 200,
      whoIsCalling: 'warm-cache.ts/warmCache/warmPostsCache',
      forceRefresh
    })
    results.posts = posts.length
    console.log(`✅ Cached ${posts.length} posts (main query)`)

    // Query 2: Posts with specific page sizes (needed by various pages)
    await getPosts({
      pageSize: 28,
      whoIsCalling: 'warm-cache.ts/warmCache/warmPostsCachePageSize28',
      forceRefresh
    }) // /notes page calculation
    console.log(`✅ Cached posts (pageSize: 28)`)

    // Query 3: Pinned posts (for /notes page)
    await getPosts({
      filter: {
        and: [
          { property: 'pinned', checkbox: { equals: true } },
          { property: 'blog', checkbox: { equals: false } }
        ]
      },
      whoIsCalling: 'warm-cache.ts/warmCache/warmPinnedPosts',
      forceRefresh
    })
    console.log(`✅ Cached pinned posts`)

    // Query 4: Blog posts (for /notes page)
    await getPosts({
      pageSize: 6,
      filter: {
        property: 'blog',
        checkbox: { equals: true }
      },
      whoIsCalling: 'warm-cache.ts/warmCache/warmBlogPosts',
      forceRefresh
    })
    console.log(`✅ Cached blog posts (pageSize: 6)\n`)

    // Query 5: Posts by each tag (needed for homepage topic sections)
    console.log('🏷️  Fetching posts by tags...')
    const topics = await getTopics({
      whoIsCalling: 'scripts/warm-cache.ts/warmCache/getTopicsForTagQueries',
      forceRefresh
    })
    let tagCacheCount = 0
    for (const topic of topics) {
      try {
        await getPosts({
          filter: {
            property: 'tags',
            multi_select: { contains: topic.name }
          },
          pageSize: 12,
          whoIsCalling: `warm-cache.ts/warmCache/warmPostsByTag/${topic.name}`,
          forceRefresh
        })
        tagCacheCount++
        if (tagCacheCount % 5 === 0) {
          console.log(`   Cached ${tagCacheCount}/${topics.length} tag queries...`)
        }
      } catch (error) {
        console.error(`   ⚠️  Failed to cache posts for tag ${topic.name}:`, error)
      }
    }
    console.log(`✅ Cached posts for ${tagCacheCount} tags\n`)
  } catch (error) {
    console.error('❌ Failed to cache posts:', error)
    results.errors.push('posts')
  }

  // Warm Books Cache
  try {
    console.log('📚 Fetching books...')
    const { books } = await getUnofficialBooks({
      whoIsCalling: 'scripts/warm-cache.ts/warmCache/warmBooksCache',
      forceRefresh
    })
    results.books = books.length
    console.log(`✅ Cached ${books.length} books\n`)
  } catch (error) {
    console.error('❌ Failed to cache books:', error)
    results.errors.push('books')
  }

  // Warm Tools Cache
  try {
    console.log('🛠️  Fetching tools...')
    const { tools } = await getUnofficialTools({
      whoIsCalling: 'scripts/warm-cache.ts/warmCache/warmToolsCache',
      forceRefresh
    })
    results.tools = tools.length
    console.log(`✅ Cached ${tools.length} tools\n`)
  } catch (error) {
    console.error('❌ Failed to cache tools:', error)
    results.errors.push('tools')
  }

  // Warm Page Content Cache (Most Important!)
  try {
    console.log('📄 Fetching page content for all posts...')
    const allPosts = await getPosts({
      pageSize: 100,
      whoIsCalling: 'warm-cache.ts/warmCache/warmPageContent',
      forceRefresh
    })

    let successCount = 0
    let failCount = 0

    // Batch process to avoid overwhelming the API
    const batchSize = 5
    for (let i = 0; i < allPosts.length; i += batchSize) {
      const batch = allPosts.slice(i, i + batchSize)
      const batchPromises = batch.map(async post => {
        if (!post.id) {
          failCount++
          console.error(`   ⚠️  Skipped post ${post.slug}: missing ID`)
          return
        }
        try {
          await getRecordMap(post.id, {
            whoIsCalling: 'scripts/warm-cache.ts/warmCache/warmPageContent',
            forceRefresh
          })
          successCount++
          if (successCount % 10 === 0) {
            console.log(`   Cached ${successCount}/${allPosts.length} pages...`)
          }
        } catch (error) {
          failCount++
          console.error(`   ⚠️  Failed to cache page ${post.slug} (${post.id}):`, error)
        }
      })
      await Promise.all(batchPromises)
    }

    results.pages = successCount
    console.log(`✅ Cached ${successCount} pages (${failCount} failed)\n`)

    if (failCount > 0) {
      console.log(`⚠️  ${failCount} pages failed to cache but continuing...\n`)
    }
  } catch (error) {
    console.error('❌ Failed to cache pages:', error)
    results.errors.push('pages')
  }

  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log('─'.repeat(50))
  console.log('📊 Cache Warming Summary:')
  console.log('─'.repeat(50))
  console.log(`⏱️  Duration: ${duration}s`)
  console.log(`📋 Topics: ${results.topics}`)
  console.log(`📝 Posts metadata: ${results.posts}`)
  console.log(`📄 Page content: ${results.pages}`)
  console.log(`📚 Books: ${results.books}`)
  console.log(`🛠️  Tools: ${results.tools}`)
  console.log(
    `📦 Total items cached: ${results.topics + results.posts + results.pages + results.books + results.tools}`
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
