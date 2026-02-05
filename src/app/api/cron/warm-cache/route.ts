/**
 * Post-Deployment Cache Warming API
 *
 * This endpoint is called automatically by GitHub Actions after each successful deployment.
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
 * - Endpoint warms Redis cache with fresh Notion data
 *
 * Security:
 * - Requires Authorization: Bearer <DEPLOY_HOOK_SECRET> header
 * - Skips warming if DISABLE_REDIS_CACHE=true
 *
 * Manual call:
 * curl -X POST https://dinhanhthi.com/api/cron/warm-cache \
 *   -H "Authorization: Bearer YOUR_DEPLOY_HOOK_SECRET"
 */

import { getPosts, getTopics, getUnofficialBooks, getUnofficialTools } from '@/src/lib/fetcher'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 59 // Max for Hobby plan

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

  console.log('🔥 Starting cache warming after deployment...')

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
    const topics = await getTopics({
      whoIsCalling: 'api/cron/warm-cache/route.ts/POST/warmTopicsCache'
    })
    results.topics = topics.length
    console.log(`✅ Cached ${topics.length} topics`)
  } catch (error) {
    console.error('❌ Failed to cache topics:', error)
    results.errors.push('topics')
  }

  // Warm Posts Cache (all queries needed by pages)
  try {
    // Query 1: Main posts
    const allPosts = await getPosts({
      pageSize: 200,
      whoIsCalling: 'api/cron/warm-cache/route.ts/POST/warmPostsCache'
    })
    results.posts = allPosts.length
    console.log(`✅ Cached ${allPosts.length} posts (main query)`)

    // Query 2: Specific page sizes
    await getPosts({
      pageSize: 28,
      whoIsCalling: 'api/cron/warm-cache/route.ts/POST/warmPostsCachePageSize28'
    })
    console.log(`✅ Cached posts (pageSize: 28)`)

    // Query 3: Pinned posts
    await getPosts({
      filter: {
        and: [
          { property: 'pinned', checkbox: { equals: true } },
          { property: 'blog', checkbox: { equals: false } }
        ]
      },
      whoIsCalling: 'api/cron/warm-cache/route.ts/POST/warmPinnedPosts'
    })
    console.log(`✅ Cached pinned posts`)

    // Query 4: Blog posts
    await getPosts({
      pageSize: 6,
      filter: {
        property: 'blog',
        checkbox: { equals: true }
      },
      whoIsCalling: 'api/cron/warm-cache/route.ts/POST/warmBlogPosts'
    })
    console.log(`✅ Cached blog posts`)

    // Query 5: Posts by each tag
    const topics = await getTopics({
      whoIsCalling: 'api/cron/warm-cache/route.ts/POST/getTopicsForTagQueries'
    })
    for (const topic of topics) {
      try {
        await getPosts({
          filter: {
            property: 'tags',
            multi_select: { contains: topic.name }
          },
          pageSize: 12,
          whoIsCalling: `api/cron/warm-cache/route.ts/POST/warmPostsByTag/${topic.name}`
        })
        console.log(`✅ Cached posts for tag: ${topic.name}`)
      } catch (error) {
        console.error(`⚠️ Failed to cache posts for tag ${topic.name}:`, error)
      }
    }
  } catch (error) {
    console.error('❌ Failed to cache posts:', error)
    results.errors.push('posts')
  }

  // Warm Books Cache
  try {
    const { books } = await getUnofficialBooks({
      whoIsCalling: 'api/cron/warm-cache/route.ts/POST/warmBooksCache'
    })
    results.books = books.length
    console.log(`✅ Cached ${books.length} books`)
  } catch (error) {
    console.error('❌ Failed to cache books:', error)
    results.errors.push('books')
  }

  // Warm Tools Cache
  try {
    const { tools } = await getUnofficialTools({
      whoIsCalling: 'api/cron/warm-cache/route.ts/POST/warmToolsCache'
    })
    results.tools = tools.length
    console.log(`✅ Cached ${tools.length} tools`)
  } catch (error) {
    console.error('❌ Failed to cache tools:', error)
    results.errors.push('tools')
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2)

  return NextResponse.json({
    success: results.errors.length === 0,
    duration: `${duration}s`,
    results,
    timestamp: new Date().toISOString()
  })
}
