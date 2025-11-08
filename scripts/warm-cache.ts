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
 * Warm a specific note by slug:
 *   pnpm run warm-cache --slug=my-note-slug           # Warm single note by slug
 *   pnpm run warm-cache --slug=my-note-slug --force   # Force refresh single note
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
import { queryDefinitions } from '@/src/lib/query-definitions'

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  // Foreground colors
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  gray: '\x1b[90m'
}

// Helper functions for colored output
const c = {
  title: (text: string) => `${colors.bright}${colors.cyan}${text}${colors.reset}`,
  id: (text: string) => `${colors.bright}${colors.magenta}${text}${colors.reset}`,
  slug: (text: string) => `${colors.bright}${colors.blue}${text}${colors.reset}`,
  number: (text: string | number) => `${colors.bright}${colors.yellow}${text}${colors.reset}`,
  success: (text: string) => `${colors.bright}${colors.green}${text}${colors.reset}`,
  error: (text: string) => `${colors.bright}${colors.red}${text}${colors.reset}`,
  dim: (text: string) => `${colors.dim}${text}${colors.reset}`,
  label: (text: string) => `${colors.bright}${text}${colors.reset}`
}

type WarmOptions = {
  forceRefresh: boolean
  slug?: string // Specific note slug to warm
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

  // Check for specific note slug
  const slugArg = args.find(arg => arg.startsWith('--slug='))
  const slug = slugArg ? slugArg.split('=')[1] : undefined

  // Check if specific pages are requested
  const hasHome = args.includes('--home')
  const hasNotes = args.includes('--notes')
  const hasTags = args.includes('--tags')
  const hasTools = args.includes('--tools')
  const hasSingle = args.includes('--single')

  // If slug is specified, only warm that specific note
  if (slug) {
    return {
      forceRefresh,
      slug,
      pages: {
        home: false,
        notes: false,
        tags: false,
        tools: false,
        single: false
      }
    }
  }

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

  // Handle single note slug warming
  if (options.slug) {
    console.log(
      `🔥 Starting cache warming for note: ${c.slug(options.slug)} (${c.label(mode)} mode)...\n`
    )
    if (options.forceRefresh) {
      console.log('⚡ Force refresh enabled: Will fetch latest data from Notion API\n')
    } else {
      console.log('ℹ️  Normal mode: Will use existing cache if available\n')
    }

    const startTime = Date.now()
    try {
      // First, get all posts to find the note by slug
      console.log(`🔍 Finding note with slug: ${c.slug(options.slug)}...`)
      const allPosts = await getUnofficialPosts({
        whoIsCalling: 'warm-cache.ts/warmCache/warmSingleNoteBySlug/getUnofficialPosts',
        forceRefresh: options.forceRefresh
      })

      const post = allPosts.find(p => p.slug === options.slug)
      if (!post) {
        console.error(`❌ Note with slug ${c.error(options.slug)} not found`)
        process.exit(1)
      }

      if (!post.id) {
        console.error(`❌ Note ${c.error(options.slug)} has no ID`)
        process.exit(1)
      }

      console.log(
        `✅ Found note: ${c.title(post.title || post.slug)} ${c.dim(`(ID: ${post.id})`)}\n`
      )

      // Warm the page content cache
      console.log('📄 Fetching page content...')
      await getRecordMap(post.id, {
        whoIsCalling: 'warm-cache.ts/warmCache/warmSingleNoteBySlug',
        forceRefresh: options.forceRefresh
      })

      const duration = ((Date.now() - startTime) / 1000).toFixed(2)
      console.log(`✅ Successfully cached page content\n`)
      console.log('─'.repeat(50))
      console.log('📊 Cache Warming Summary:')
      console.log('─'.repeat(50))
      console.log(`⏱️  Duration: ${c.number(duration)}s`)
      console.log(`📄 Note: ${c.title(post.title || post.slug)}`)
      console.log(`🔗 Slug: ${c.slug(post.slug)}`)
      console.log(`🆔 ID: ${c.id(post.id)}`)
      console.log(`\n${c.success('✅ Cache warming completed successfully!')}`)
      process.exit(0)
    } catch (error) {
      console.error(`${c.error('❌ Failed to warm cache for note:')}`, error)
      process.exit(1)
    }
  }

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

  // ============================================================================
  // STEP 1: Warm Topics Cache ONCE (needed by home, notes, and tags pages)
  // ============================================================================
  let cachedTopics: Awaited<ReturnType<typeof getTopics>> | null = null
  if (options.pages.home || options.pages.tags || options.pages.notes) {
    try {
      const pageLabel = []
      if (options.pages.home) pageLabel.push('HOME')
      if (options.pages.notes) pageLabel.push('NOTES')
      if (options.pages.tags) pageLabel.push('TAGS')
      console.log(`📋 [${pageLabel.join('/')} PAGE] Fetching topics...`)

      cachedTopics = await getTopics({
        whoIsCalling: 'scripts/warm-cache.ts/warmCache/warmTopicsCache',
        forceRefresh: options.forceRefresh
      })
      results.topics = cachedTopics.length
      console.log(`✅ Cached ${c.number(cachedTopics.length)} topics\n`)
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
      console.log(`✅ Cached ${c.number(unofficialPosts.length)} unofficial posts\n`)
    } catch (error) {
      console.error('❌ Failed to cache unofficial posts:', error)
      results.errors.push('unofficialPosts')
    }
  }

  // ============================================================================
  // STEP 2: Warm Posts Cache (Official Notion DB API) - ACTUAL PRODUCTION QUERIES ONLY
  // ============================================================================
  if (options.pages.home || options.pages.notes || options.pages.tags) {
    try {
      console.log('📝 Fetching posts (production queries)...')

      // HOME PAGE QUERIES
      if (options.pages.home) {
        // Query: Blog posts section
        await getPosts({
          ...queryDefinitions.homePage.blogPosts,
          whoIsCalling: 'warm-cache.ts/warmCache/homePageBlogPosts',
          forceRefresh: options.forceRefresh
        })
        console.log(
          `✅ [HOME PAGE] Cached blog posts (pageSize: ${c.number(queryDefinitions.homePage.blogPosts.pageSize ?? 'N/A')})`
        )

        // Query: Pinned posts section
        await getPosts({
          ...queryDefinitions.homePage.pinnedPosts,
          whoIsCalling: 'warm-cache.ts/warmCache/homePagePinnedPosts',
          forceRefresh: options.forceRefresh
        })
        console.log(
          `✅ [HOME PAGE] Cached pinned posts (pageSize: ${c.number(queryDefinitions.homePage.pinnedPosts.pageSize ?? 'N/A')})`
        )

        // Query: Recent notes section
        const homePosts = await getPosts({
          ...queryDefinitions.homePage.recentNotes,
          whoIsCalling: 'warm-cache.ts/warmCache/homePageRecentNotes',
          forceRefresh: options.forceRefresh
        })
        results.posts += homePosts.length
        console.log(
          `✅ [HOME PAGE] Cached recent notes (pageSize: ${c.number(queryDefinitions.homePage.recentNotes.pageSize ?? 'N/A')})`
        )
      }

      // NOTES PAGE QUERIES
      if (options.pages.notes) {
        // Query: Pinned posts (no pageSize = get ALL)
        await getPosts({
          ...queryDefinitions.notesPage.pinnedPosts,
          whoIsCalling: 'warm-cache.ts/warmCache/notesPagePinnedPosts',
          forceRefresh: options.forceRefresh
        })
        console.log(`✅ [NOTES PAGE] Cached pinned posts ${c.number('ALL')}`)

        // Query: Blog posts
        await getPosts({
          ...queryDefinitions.notesPage.blogPosts,
          whoIsCalling: 'warm-cache.ts/warmCache/notesPageBlogPosts',
          forceRefresh: options.forceRefresh
        })
        console.log(
          `✅ [NOTES PAGE] Cached blog posts (pageSize: ${c.number(queryDefinitions.notesPage.blogPosts.pageSize ?? 'N/A')})`
        )

        // Query: Recent posts (max 15, excluding pinned and blog posts)
        const recentPosts = await getPosts({
          ...queryDefinitions.notesPage.recentPosts,
          whoIsCalling: 'warm-cache.ts/warmCache/notesPageRecentPosts',
          forceRefresh: options.forceRefresh
        })
        results.posts += recentPosts.length
        console.log(
          `✅ [NOTES PAGE] Cached recent posts (pageSize: ${c.number(queryDefinitions.notesPage.recentPosts.pageSize ?? 'N/A')})`
        )

        // Query: Posts by pinned tags - REUSE CACHED TOPICS
        if (cachedTopics) {
          const pinnedTags = cachedTopics.filter(tag => tag.pinned)
          // Put "Others" at the end
          const others = pinnedTags.find(tag => tag.name === 'Others')
          const pinnedTagsSorted = pinnedTags.filter(tag => tag.name !== 'Others')
          if (others) pinnedTagsSorted.push(others)

          console.log(`🏷️  [NOTES PAGE] Fetching posts by pinned tags...`)
          let pinnedTagCacheCount = 0
          for (const tag of pinnedTagsSorted) {
            try {
              await getPosts({
                ...queryDefinitions.notesPage.postsByPinnedTag(tag.name),
                whoIsCalling: `warm-cache.ts/warmCache/notesPagePostsByPinnedTag/${tag.name}`,
                forceRefresh: options.forceRefresh
              })
              pinnedTagCacheCount++
              if (pinnedTagCacheCount % 5 === 0) {
                console.log(
                  `   Cached ${c.number(pinnedTagCacheCount)}/${c.number(pinnedTagsSorted.length)} pinned tags...`
                )
              }
            } catch (error) {
              console.error(
                `   ⚠️  Failed to cache posts for pinned tag ${c.error(tag.name)}:`,
                error
              )
            }
          }
          console.log(
            `✅ [NOTES PAGE] Cached posts for ${c.number(pinnedTagCacheCount)} pinned tags`
          )
        } else {
          console.log('⚠️  Skipping pinned tag posts: topics cache not available')
        }
      }

      // BLOGS PAGE QUERIES
      if (options.pages.home || options.pages.notes) {
        // Query: All blogs (no pageSize = get ALL) - used for pagination
        const allBlogs = await getPosts({
          ...queryDefinitions.blogsPage.allBlogs,
          whoIsCalling: 'warm-cache.ts/warmCache/blogsPageAllBlogs',
          forceRefresh: options.forceRefresh
        })
        results.posts += allBlogs.length
        console.log(
          `✅ [BLOGS PAGE] Cached all blogs (${c.number(allBlogs.length)} blogs, ${c.number('ALL')})`
        )
      }

      // TAGS PAGE QUERIES - REUSE CACHED TOPICS
      if (options.pages.tags && cachedTopics) {
        console.log(`🏷️  [TAGS PAGE] Fetching posts by tags...`)
        let tagCacheCount = 0
        for (const topic of cachedTopics) {
          try {
            // Query: All posts by tag (for getTotalPages)
            await getPosts({
              ...queryDefinitions.tagPage.allPostsByTag(topic.name),
              whoIsCalling: `warm-cache.ts/warmCache/tagPageAllPostsByTag/${topic.name}`,
              forceRefresh: options.forceRefresh
            })

            // Query: Regular posts by tag
            await getPosts({
              ...queryDefinitions.tagPage.regularPostsByTag(topic.name),
              whoIsCalling: `warm-cache.ts/warmCache/tagPageRegularPostsByTag/${topic.name}`,
              forceRefresh: options.forceRefresh
            })

            // Query: Blog posts by tag
            await getPosts({
              ...queryDefinitions.tagPage.blogPostsByTag(topic.name),
              whoIsCalling: `warm-cache.ts/warmCache/tagPageBlogPostsByTag/${topic.name}`,
              forceRefresh: options.forceRefresh
            })

            tagCacheCount++
            if (tagCacheCount % 5 === 0) {
              console.log(
                `   Cached ${c.number(tagCacheCount)}/${c.number(cachedTopics.length)} tags ${c.dim('(3 queries per tag)')}...`
              )
            }
          } catch (error) {
            console.error(`   ⚠️  Failed to cache posts for tag ${c.error(topic.name)}:`, error)
          }
        }
        console.log(
          `✅ Cached posts for ${c.number(tagCacheCount)} tags (${c.number(tagCacheCount * 3)} total queries)\n`
        )
      } else if (options.pages.tags && !cachedTopics) {
        console.log('⚠️  Skipping tags page queries: topics cache not available\n')
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
      console.log(`✅ Cached ${c.number(books.length)} books\n`)
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
      console.log(`✅ Cached ${c.number(tools.length)} tools\n`)
    } catch (error) {
      console.error('❌ Failed to cache tools:', error)
      results.errors.push('tools')
    }
  }

  // ============================================================================
  // STEP 3: Warm Page Content Cache (for single note pages - Most Important!)
  // ============================================================================
  if (options.pages.single) {
    try {
      console.log('📄 [SINGLE NOTE PAGES] Fetching page content for all posts...')
      // Use getUnofficialPosts() to get all posts metadata (not limited to 100)
      // This is more efficient than getPosts() for getting all posts
      const allPosts = await getUnofficialPosts({
        whoIsCalling: 'warm-cache.ts/warmCache/warmPageContent/getUnofficialPosts',
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
            console.error(`   ⚠️  Skipped post ${c.error(post.slug)}: missing ID`)
            return
          }
          try {
            await getRecordMap(post.id, {
              whoIsCalling: 'scripts/warm-cache.ts/warmCache/warmPageContent',
              forceRefresh: options.forceRefresh
            })
            successCount++
            if (successCount % 10 === 0) {
              console.log(
                `   Cached ${c.number(successCount)}/${c.number(allPosts.length)} pages...`
              )
            }
          } catch (error) {
            failCount++
            console.error(
              `   ⚠️  Failed to cache page ${c.error(post.slug)} ${c.dim(`(${post.id})`)}:`,
              error
            )
          }
        })
        await Promise.all(batchPromises)
      }

      results.pages = successCount
      console.log(`✅ Cached ${c.number(successCount)} pages ${c.dim(`(${failCount} failed)`)}\n`)

      if (failCount > 0) {
        console.log(`⚠️  ${c.number(failCount)} pages failed to cache but continuing...\n`)
      }
    } catch (error) {
      console.error('❌ Failed to cache pages:', error)
      results.errors.push('pages')
    }
  }

  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2)
  const totalItems =
    results.topics +
    results.unofficialPosts +
    results.posts +
    results.pages +
    results.books +
    results.tools

  console.log('─'.repeat(50))
  console.log(`📊 ${c.label('Cache Warming Summary:')}`)
  console.log('─'.repeat(50))
  console.log(`⏱️  Duration: ${c.number(duration)}s`)
  console.log(`📋 Topics: ${c.number(results.topics)}`)
  console.log(`📰 Unofficial Posts: ${c.number(results.unofficialPosts)}`)
  console.log(`📝 Posts metadata: ${c.number(results.posts)}`)
  console.log(`📄 Page content: ${c.number(results.pages)}`)
  console.log(`📚 Books: ${c.number(results.books)}`)
  console.log(`🛠️  Tools: ${c.number(results.tools)}`)
  console.log(`📦 Total items cached: ${c.success(totalItems.toString())}`)

  if (results.errors.length > 0) {
    console.log(`\n⚠️  Errors occurred for: ${c.error(results.errors.join(', '))}`)
    process.exit(1)
  } else {
    console.log(`\n${c.success('✅ Cache warming completed successfully!')}`)
    process.exit(0)
  }
}

// Run the script
warmCache().catch(error => {
  console.error('💥 Unexpected error during cache warming:', error)
  process.exit(1)
})
