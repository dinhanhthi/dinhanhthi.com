/**
 * Vercel Deploy Hook: Warm Cache
 *
 * This endpoint is called automatically by Vercel after each successful deployment.
 *
 * Setup in Vercel Dashboard:
 * 1. Go to Project Settings → Git → Deploy Hooks
 * 2. Create a new Deploy Hook with this URL: https://dinhanhthi.com/api/cron/warm-cache
 * 3. Set the secret in environment variable: DEPLOY_HOOK_SECRET
 *
 * Security:
 * - Vercel will send the secret in the "x-vercel-signature" header
 * - Or use Authorization header with Bearer token
 *
 * Manual call:
 * curl -X POST https://dinhanhthi.com/api/cron/warm-cache \
 *   -H "Authorization: Bearer YOUR_DEPLOY_HOOK_SECRET"
 */

import { getPosts, getTopics, getUnofficialBooks, getUnofficialTools } from '@/src/lib/fetcher'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes max

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
  const authHeader = request.headers.get('authorization')
  const vercelSignature = request.headers.get('x-vercel-signature')
  const deployHookSecret = process.env.DEPLOY_HOOK_SECRET

  // Accept either Vercel signature or Bearer token
  const isAuthorized =
    !deployHookSecret || // Allow if no secret configured (dev mode)
    authHeader === `Bearer ${deployHookSecret}` ||
    vercelSignature === deployHookSecret

  if (!isAuthorized) {
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
    const topics = await getTopics()
    results.topics = topics.length
    console.log(`✅ Cached ${topics.length} topics`)
  } catch (error) {
    console.error('❌ Failed to cache topics:', error)
    results.errors.push('topics')
  }

  // Warm Posts Cache (all queries needed by pages)
  try {
    // Query 1: Main posts
    const allPosts = await getPosts({ pageSize: 200 })
    results.posts = allPosts.length
    console.log(`✅ Cached ${allPosts.length} posts (main query)`)

    // Query 2: Specific page sizes
    await getPosts({ pageSize: 28 })
    console.log(`✅ Cached posts (pageSize: 28)`)

    // Query 3: Pinned posts
    await getPosts({
      filter: {
        and: [
          { property: 'pinned', checkbox: { equals: true } },
          { property: 'blog', checkbox: { equals: false } }
        ]
      }
    })
    console.log(`✅ Cached pinned posts`)

    // Query 4: Blog posts
    await getPosts({
      pageSize: 6,
      filter: {
        property: 'blog',
        checkbox: { equals: true }
      }
    })
    console.log(`✅ Cached blog posts`)

    // Query 5: Posts by each tag
    const topics = await getTopics()
    for (const topic of topics) {
      try {
        await getPosts({
          filter: {
            property: 'tags',
            multi_select: { contains: topic.name }
          },
          pageSize: 12
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
    const { books } = await getUnofficialBooks()
    results.books = books.length
    console.log(`✅ Cached ${books.length} books`)
  } catch (error) {
    console.error('❌ Failed to cache books:', error)
    results.errors.push('books')
  }

  // Warm Tools Cache
  try {
    const { tools } = await getUnofficialTools()
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
