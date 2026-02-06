/**
 * Post-Deployment Cache Warming API
 *
 * This endpoint is called automatically by GitHub Actions after each successful deployment.
 * It mirrors the behavior of `pnpm run warm-cache --force` (force warm all pages).
 *
 * Setup:
 * 1. Add GitHub Secrets (Settings → Secrets and variables → Actions):
 *    - SITE_URL: Your production URL (e.g., https://dinhanhthi.com)
 *    - DEPLOY_HOOK_SECRET: Random secret token for authentication
 *
 * 2. Add Amplify Environment Variable:
 *    - DEPLOY_HOOK_SECRET: Same secret as GitHub (for API authentication)
 *
 * 3. GitHub Action workflow is at: .github/workflows/warm-cache-after-deploy.yml
 *    - Triggers on: deployment_status event (Production only)
 *    - Calls this endpoint after successful deployment
 *
 * How it works:
 * - Amplify deploys your site → triggers GitHub deployment_status event
 * - GitHub Action detects successful production deployment
 * - Action calls this endpoint with Authorization header
 * - Endpoint warms Redis cache with fresh Notion data (force refresh)
 *
 * Security:
 * - Requires Authorization: Bearer <DEPLOY_HOOK_SECRET> header
 * - Skips warming if DISABLE_REDIS_CACHE=true
 *
 * Manual call:
 * curl -X POST https://dinhanhthi.com/api/cron/warm-cache \
 *   -H "Authorization: Bearer YOUR_DEPLOY_HOOK_SECRET"
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
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 900 // AWS Lambda max: 15 minutes

const WHO = 'api/cron/warm-cache'

export async function POST(request: NextRequest) {
  // Check if Redis cache is disabled
  if (process.env.DISABLE_REDIS_CACHE === 'true') {
    console.log('⚠️ Redis cache is disabled. Skipping cache warming.')
    return NextResponse.json({
      success: false,
      message: 'Redis cache is disabled (DISABLE_REDIS_CACHE=true)',
      timestamp: new Date().toISOString()
    })
  }

  // Verify deploy hook secret (security)
  const deployHookSecret = process.env.DEPLOY_HOOK_SECRET
  const authHeader = request.headers.get('authorization')

  // In production, DEPLOY_HOOK_SECRET is required
  if (!deployHookSecret) {
    console.error('❌ DEPLOY_HOOK_SECRET is not configured')
    return NextResponse.json(
      {
        error: 'Server configuration error',
        message: 'DEPLOY_HOOK_SECRET environment variable is required'
      },
      { status: 500 }
    )
  }

  // Verify Bearer token
  if (authHeader !== `Bearer ${deployHookSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('🔥 Starting cache warming after deployment (force refresh)...')

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
  // STEP 1: Warm Topics Cache (needed by home, notes, and tags pages)
  // ============================================================================
  let cachedTopics: Awaited<ReturnType<typeof getTopics>> | null = null
  try {
    cachedTopics = await getTopics({
      whoIsCalling: `${WHO}/warmTopicsCache`,
      forceRefresh: true
    })
    results.topics = cachedTopics.length
    console.log(`✅ Cached ${cachedTopics.length} topics`)
  } catch (error) {
    console.error('❌ Failed to cache topics:', error)
    results.errors.push('topics')
  }

  // ============================================================================
  // STEP 2: Warm Unofficial Posts Cache (needed by notes page + single pages)
  // ============================================================================
  let allUnofficialPosts: Awaited<ReturnType<typeof getUnofficialPosts>> | null = null
  try {
    allUnofficialPosts = await getUnofficialPosts({
      whoIsCalling: `${WHO}/warmUnofficialPostsCache`,
      forceRefresh: true
    })
    results.unofficialPosts = allUnofficialPosts.length
    console.log(`✅ Cached ${allUnofficialPosts.length} unofficial posts`)
  } catch (error) {
    console.error('❌ Failed to cache unofficial posts:', error)
    results.errors.push('unofficialPosts')
  }

  // ============================================================================
  // STEP 3: Warm Posts Cache (Official Notion DB API) - PRODUCTION QUERIES
  // ============================================================================
  try {
    // --- HOME PAGE QUERIES ---
    await getPosts({
      ...queryDefinitions.homePage.blogPosts,
      whoIsCalling: `${WHO}/homePageBlogPosts`,
      forceRefresh: true
    })
    console.log(`✅ [HOME] Cached blog posts`)

    await getPosts({
      ...queryDefinitions.homePage.pinnedPosts,
      whoIsCalling: `${WHO}/homePagePinnedPosts`,
      forceRefresh: true
    })
    console.log(`✅ [HOME] Cached pinned posts`)

    const homePosts = await getPosts({
      ...queryDefinitions.homePage.recentNotes,
      whoIsCalling: `${WHO}/homePageRecentNotes`,
      forceRefresh: true
    })
    results.posts += homePosts.length
    console.log(`✅ [HOME] Cached recent notes`)

    // --- NOTES PAGE QUERIES ---
    await getPosts({
      ...queryDefinitions.notesPage.pinnedPosts,
      whoIsCalling: `${WHO}/notesPagePinnedPosts`,
      forceRefresh: true
    })
    console.log(`✅ [NOTES] Cached pinned posts`)

    await getPosts({
      ...queryDefinitions.notesPage.blogPosts,
      whoIsCalling: `${WHO}/notesPageBlogPosts`,
      forceRefresh: true
    })
    console.log(`✅ [NOTES] Cached blog posts`)

    const recentPosts = await getPosts({
      ...queryDefinitions.notesPage.recentPosts,
      whoIsCalling: `${WHO}/notesPageRecentPosts`,
      forceRefresh: true
    })
    results.posts += recentPosts.length
    console.log(`✅ [NOTES] Cached recent posts`)

    // Notes page: Posts by pinned tags
    if (cachedTopics) {
      const pinnedTags = cachedTopics.filter(tag => tag.pinned)
      const others = pinnedTags.find(tag => tag.name === 'Others')
      const pinnedTagsSorted = pinnedTags.filter(tag => tag.name !== 'Others')
      if (others) pinnedTagsSorted.push(others)

      for (const tag of pinnedTagsSorted) {
        try {
          await getPosts({
            ...queryDefinitions.notesPage.postsByPinnedTag(tag.name),
            whoIsCalling: `${WHO}/notesPagePostsByPinnedTag/${tag.name}`,
            forceRefresh: true
          })
        } catch (error) {
          console.error(`⚠️ Failed to cache posts for pinned tag ${tag.name}:`, error)
        }
      }
      console.log(`✅ [NOTES] Cached posts for ${pinnedTagsSorted.length} pinned tags`)
    }

    // --- BLOGS PAGE QUERIES ---
    const allBlogs = await getPosts({
      ...queryDefinitions.blogsPage.allBlogs,
      whoIsCalling: `${WHO}/blogsPageAllBlogs`,
      forceRefresh: true
    })
    results.posts += allBlogs.length
    console.log(`✅ [BLOGS] Cached all blogs (${allBlogs.length})`)

    // --- TAGS PAGE QUERIES ---
    if (cachedTopics) {
      let tagCacheCount = 0
      for (const topic of cachedTopics) {
        try {
          await getPosts({
            ...queryDefinitions.tagPage.allPostsByTag(topic.name),
            whoIsCalling: `${WHO}/tagPageAllPostsByTag/${topic.name}`,
            forceRefresh: true
          })
          await getPosts({
            ...queryDefinitions.tagPage.regularPostsByTag(topic.name),
            whoIsCalling: `${WHO}/tagPageRegularPostsByTag/${topic.name}`,
            forceRefresh: true
          })
          await getPosts({
            ...queryDefinitions.tagPage.blogPostsByTag(topic.name),
            whoIsCalling: `${WHO}/tagPageBlogPostsByTag/${topic.name}`,
            forceRefresh: true
          })
          tagCacheCount++
        } catch (error) {
          console.error(`⚠️ Failed to cache posts for tag ${topic.name}:`, error)
        }
      }
      console.log(`✅ [TAGS] Cached posts for ${tagCacheCount} tags (${tagCacheCount * 3} queries)`)
    }
  } catch (error) {
    console.error('❌ Failed to cache posts:', error)
    results.errors.push('posts')
  }

  // ============================================================================
  // STEP 4: Warm Books Cache
  // ============================================================================
  try {
    const { books } = await getUnofficialBooks({
      whoIsCalling: `${WHO}/warmBooksCache`,
      forceRefresh: true
    })
    results.books = books.length
    console.log(`✅ Cached ${books.length} books`)
  } catch (error) {
    console.error('❌ Failed to cache books:', error)
    results.errors.push('books')
  }

  // ============================================================================
  // STEP 5: Warm Tools Cache
  // ============================================================================
  try {
    const { tools } = await getUnofficialTools({
      whoIsCalling: `${WHO}/warmToolsCache`,
      forceRefresh: true
    })
    results.tools = tools.length
    console.log(`✅ Cached ${tools.length} tools`)
  } catch (error) {
    console.error('❌ Failed to cache tools:', error)
    results.errors.push('tools')
  }

  // ============================================================================
  // STEP 6: Warm Single Note Pages (page content / recordMap)
  // ============================================================================
  if (allUnofficialPosts) {
    try {
      let successCount = 0
      let failCount = 0

      const batchSize = 5
      for (let i = 0; i < allUnofficialPosts.length; i += batchSize) {
        const batch = allUnofficialPosts.slice(i, i + batchSize)
        const batchPromises = batch.map(async post => {
          if (!post.id) {
            failCount++
            return
          }
          try {
            await getRecordMap(post.id, {
              whoIsCalling: `${WHO}/warmPageContent`,
              forceRefresh: true
            })
            successCount++
          } catch (error) {
            failCount++
            console.error(`⚠️ Failed to cache page ${post.slug} (${post.id}):`, error)
          }
        })
        await Promise.all(batchPromises)
      }

      results.pages = successCount
      console.log(`✅ Cached ${successCount} pages (${failCount} failed)`)
    } catch (error) {
      console.error('❌ Failed to cache pages:', error)
      results.errors.push('pages')
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2)

  console.log(`🏁 Cache warming completed in ${duration}s`)

  return NextResponse.json({
    success: results.errors.length === 0,
    duration: `${duration}s`,
    results,
    timestamp: new Date().toISOString()
  })
}
