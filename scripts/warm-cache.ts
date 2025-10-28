#!/usr/bin/env tsx

/**
 * Cache Warming Script
 *
 * This script warms up the Redis cache by fetching all main data sources.
 * Run this after deployment to ensure cache is populated before users visit.
 *
 * Usage:
 *   pnpm run warm-cache              # Normal mode: warm all cache
 *   pnpm run warm-cache --force      # Force mode: override all cache with fresh data
 *
 * Warm specific pages:
 *   pnpm run warm-cache --home       # Warm home page cache only
 *   pnpm run warm-cache --notes      # Warm notes page cache only
 *   pnpm run warm-cache --tags       # Warm tags page cache only
 *   pnpm run warm-cache --tools      # Warm tools/books/reading pages cache only
 *   pnpm run warm-cache --single     # Warm single note pages cache only
 *
 * Combine multiple pages:
 *   pnpm run warm-cache --home --tags --force
 *
 * Or with tsx directly:
 *   npx tsx scripts/warm-cache.ts
 *   npx tsx scripts/warm-cache.ts --force --home --notes
 */

import {
  getPosts,
  getRecordMap,
  getTopics,
  getUnofficialBooks,
  getUnofficialPosts,
  getUnofficialTools
} from '@/src/lib/fetcher'

type WarmOptions = {
  forceRefresh: boolean
  pages: {
    home: boolean
    notes: boolean
    tags: boolean
    tools: boolean
    single: boolean
  }
}

function parseArgs(): WarmOptions {
  const args = process.argv.slice(2)
  const forceRefresh = args.includes('--force')

  // Check if specific pages are requested
  const hasHome = args.includes('--home')
  const hasNotes = args.includes('--notes')
  const hasTags = args.includes('--tags')
  const hasTools = args.includes('--tools')
  const hasSingle = args.includes('--single')

  // If no specific pages are requested, warm all
  const warmAll = !hasHome && !hasNotes && !hasTags && !hasTools && !hasSingle

  return {
    forceRefresh,
    pages: {
      home: warmAll || hasHome,
      notes: warmAll || hasNotes,
      tags: warmAll || hasTags,
      tools: warmAll || hasTools,
      single: warmAll || hasSingle
    }
  }
}

async function warmCache() {
  // Check if Redis cache is disabled
  if (process.env.DISABLE_REDIS_CACHE === 'true') {
    console.log('⚠️  Redis cache is disabled (DISABLE_REDIS_CACHE=true)')
    console.log('⚠️  Skipping cache warming. No action needed.\n')
    console.log('💡 To enable caching, remove DISABLE_REDIS_CACHE from your .env.local')
    process.exit(0)
  }

  // Parse command line arguments
  const options = parseArgs()
  const mode = options.forceRefresh ? 'FORCE REFRESH' : 'NORMAL'

  // Determine which pages to warm
  const pagesToWarm = Object.entries(options.pages)
    .filter(([_, enabled]) => enabled)
    .map(([page]) => page)
  const warmingAll = pagesToWarm.length === 5

  console.log(`🔥 Starting cache warming (${mode} mode)...\n`)
  if (options.forceRefresh) {
    console.log(
      '⚡ Force refresh enabled: Will fetch latest data from Notion API and override cache\n'
    )
  } else {
    console.log('ℹ️  Normal mode: Will use existing cache if available\n')
    console.log('💡 Tip: Use --force flag to fetch fresh data from Notion API\n')
  }

  if (warmingAll) {
    console.log('📦 Warming all pages\n')
  } else {
    console.log(`📦 Warming selected pages: ${pagesToWarm.join(', ')}\n`)
  }

  const startTime = Date.now()
  const results = {
    topics: 0,
    unofficialPosts: 0,
    posts: 0,
    books: 0,
    tools: 0,
    pages: 0,
    errors: [] as string[]
  }

  // Warm Topics Cache (needed by tags page)
  if (options.pages.tags) {
    try {
      console.log('📋 [TAGS PAGE] Fetching topics...')
      const topics = await getTopics({
        whoIsCalling: 'scripts/warm-cache.ts/warmCache/warmTopicsCache',
        forceRefresh: options.forceRefresh
      })
      results.topics = topics.length
      console.log(`✅ Cached ${topics.length} topics\n`)
    } catch (error) {
      console.error('❌ Failed to cache topics:', error)
      results.errors.push('topics')
    }
  }

  // Warm Unofficial Posts Cache (needed by notes page)
  if (options.pages.notes) {
    try {
      console.log('📰 [NOTES PAGE] Fetching unofficial posts...')
      const unofficialPosts = await getUnofficialPosts({
        whoIsCalling: 'scripts/warm-cache.ts/warmCache/warmUnofficialPostsCache',
        forceRefresh: options.forceRefresh
      })
      results.unofficialPosts = unofficialPosts.length
      console.log(`✅ Cached ${unofficialPosts.length} unofficial posts\n`)
    } catch (error) {
      console.error('❌ Failed to cache unofficial posts:', error)
      results.errors.push('unofficialPosts')
    }
  }

  // Warm Posts Cache (Official Notion DB API)
  if (options.pages.home || options.pages.notes || options.pages.tags) {
    try {
      console.log('📝 Fetching posts...')

      // Query 1: Main posts (for recent notes section - used by multiple pages)
      if (options.pages.home || options.pages.notes) {
        const posts = await getPosts({
          pageSize: 200,
          whoIsCalling: 'warm-cache.ts/warmCache/warmPostsCache',
          forceRefresh: options.forceRefresh
        })
        results.posts = posts.length
        console.log(`✅ Cached ${posts.length} posts (main query)`)
      }

      // Query 2: Posts with specific page sizes (needed by /notes page)
      if (options.pages.notes) {
        await getPosts({
          pageSize: 28,
          whoIsCalling: 'warm-cache.ts/warmCache/warmPostsCachePageSize28',
          forceRefresh: options.forceRefresh
        }) // /notes page calculation
        console.log(`✅ [NOTES PAGE] Cached posts (pageSize: 28)`)

        // Query 3: Pinned posts (for /notes page)
        await getPosts({
          filter: {
            and: [
              { property: 'pinned', checkbox: { equals: true } },
              { property: 'blog', checkbox: { equals: false } }
            ]
          },
          whoIsCalling: 'warm-cache.ts/warmCache/warmPinnedPosts',
          forceRefresh: options.forceRefresh
        })
        console.log(`✅ [NOTES PAGE] Cached pinned posts`)
      }

      // Query 4: Blog posts (for homepage)
      if (options.pages.home) {
        await getPosts({
          pageSize: 6,
          filter: {
            property: 'blog',
            checkbox: { equals: true }
          },
          whoIsCalling: 'warm-cache.ts/warmCache/warmBlogPosts',
          forceRefresh: options.forceRefresh
        })
        console.log(`✅ [HOME PAGE] Cached blog posts (pageSize: 6)`)

        // Query 5: Regular posts (for homepage)
        await getPosts({
          pageSize: 24,
          filter: {
            property: 'blog',
            checkbox: { equals: false }
          },
          whoIsCalling: 'warm-cache.ts/warmCache/warmRegularPosts',
          forceRefresh: options.forceRefresh
        })
        console.log(`✅ [HOME PAGE] Cached regular posts (pageSize: 24)`)
      }

      // Query 6: Posts by each tag (needed for homepage topic sections and tags page)
      if (options.pages.home || options.pages.tags) {
        const pageLabel =
          options.pages.home && options.pages.tags
            ? 'HOME/TAGS PAGE'
            : options.pages.home
              ? 'HOME PAGE'
              : 'TAGS PAGE'
        console.log(`🏷️  [${pageLabel}] Fetching posts by tags...`)
        const topics = await getTopics({
          whoIsCalling: 'scripts/warm-cache.ts/warmCache/getTopicsForTagQueries',
          forceRefresh: options.forceRefresh
        })
        let tagCacheCount = 0
        for (const topic of topics) {
          try {
            // Query 6a: All posts by tag (for getTotalPages)
            await getPosts({
              filter: {
                property: 'tags',
                multi_select: { contains: topic.name }
              },
              pageSize: 12,
              whoIsCalling: `warm-cache.ts/warmCache/warmPostsByTag/${topic.name}`,
              forceRefresh: options.forceRefresh
            })

            // Query 6b: Regular posts by tag (for tag page - blog=false)
            await getPosts({
              filter: {
                and: [
                  {
                    property: 'tags',
                    multi_select: { contains: topic.name }
                  },
                  {
                    property: 'blog',
                    checkbox: { equals: false }
                  }
                ]
              },
              pageSize: 96, // numPostsPerPage * 2 (48 * 2)
              whoIsCalling: `warm-cache.ts/warmCache/warmRegularPostsByTag/${topic.name}`,
              forceRefresh: options.forceRefresh
            })

            // Query 6c: Blog posts by tag (for tag page - blog=true)
            await getPosts({
              filter: {
                and: [
                  {
                    property: 'tags',
                    multi_select: { contains: topic.name }
                  },
                  {
                    property: 'blog',
                    checkbox: { equals: true }
                  }
                ]
              },
              pageSize: 8, // numBlogPosts * 2 (4 * 2)
              whoIsCalling: `warm-cache.ts/warmCache/warmBlogPostsByTag/${topic.name}`,
              forceRefresh: options.forceRefresh
            })

            tagCacheCount++
            if (tagCacheCount % 5 === 0) {
              console.log(`   Cached ${tagCacheCount}/${topics.length} tags (3 queries per tag)...`)
            }
          } catch (error) {
            console.error(`   ⚠️  Failed to cache posts for tag ${topic.name}:`, error)
          }
        }
        console.log(
          `✅ Cached posts for ${tagCacheCount} tags (${tagCacheCount * 3} total queries)\n`
        )
      } else {
        console.log('') // Empty line for formatting
      }
    } catch (error) {
      console.error('❌ Failed to cache posts:', error)
      results.errors.push('posts')
    }
  }

  // Warm Books Cache (for /reading page)
  if (options.pages.tools) {
    try {
      console.log('📚 [READING PAGE] Fetching books...')
      const { books } = await getUnofficialBooks({
        whoIsCalling: 'scripts/warm-cache.ts/warmCache/warmBooksCache',
        forceRefresh: options.forceRefresh
      })
      results.books = books.length
      console.log(`✅ Cached ${books.length} books\n`)
    } catch (error) {
      console.error('❌ Failed to cache books:', error)
      results.errors.push('books')
    }
  }

  // Warm Tools Cache (for /tools page)
  if (options.pages.tools) {
    try {
      console.log('🛠️  [TOOLS PAGE] Fetching tools...')
      const { tools } = await getUnofficialTools({
        whoIsCalling: 'scripts/warm-cache.ts/warmCache/warmToolsCache',
        forceRefresh: options.forceRefresh
      })
      results.tools = tools.length
      console.log(`✅ Cached ${tools.length} tools\n`)
    } catch (error) {
      console.error('❌ Failed to cache tools:', error)
      results.errors.push('tools')
    }
  }

  // Warm Page Content Cache (for single note pages - Most Important!)
  if (options.pages.single) {
    try {
      console.log('📄 [SINGLE NOTE PAGES] Fetching page content for all posts...')
      const allPosts = await getPosts({
        pageSize: 100,
        whoIsCalling: 'warm-cache.ts/warmCache/warmPageContent',
        forceRefresh: options.forceRefresh
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
              forceRefresh: options.forceRefresh
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
  }

  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log('─'.repeat(50))
  console.log('📊 Cache Warming Summary:')
  console.log('─'.repeat(50))
  console.log(`⏱️  Duration: ${duration}s`)
  console.log(`📋 Topics: ${results.topics}`)
  console.log(`📰 Unofficial Posts: ${results.unofficialPosts}`)
  console.log(`📝 Posts metadata: ${results.posts}`)
  console.log(`📄 Page content: ${results.pages}`)
  console.log(`📚 Books: ${results.books}`)
  console.log(`🛠️  Tools: ${results.tools}`)
  console.log(
    `📦 Total items cached: ${results.topics + results.unofficialPosts + results.posts + results.pages + results.books + results.tools}`
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
