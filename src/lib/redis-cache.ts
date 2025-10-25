import { Redis } from '@upstash/redis'
import { sendErrorEmail } from './send-error-email'

// Initialize Redis client (singleton pattern)
let redis: Redis | null = null

function getRedisClient(): Redis | null {
  // Check if Redis is completely disabled
  if (process.env.DISABLE_REDIS_CACHE === 'true') {
    // if (process.env.NODE_ENV === 'development') {
    //   console.warn('⚠️ Redis cache is completely disabled (DISABLE_REDIS_CACHE=true)')
    // }
    return null
  }

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn('⚠️ Redis not configured - caching disabled')
    return null
  }

  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN
    })
  }

  return redis
}

export interface CacheOptions {
  /**
   * Soft TTL: Time after which cache is considered stale and should be refreshed
   * Cache will still be returned immediately, but refreshed in background
   * @default 1800 (30 minutes)
   */
  softTTL?: number
  /**
   * Hard TTL: Time after which Redis will delete the cache key
   * This is the absolute expiry time - safety net for long outages
   * @default 1209600 (14 days)
   */
  hardTTL?: number
  /**
   * Namespace/prefix for cache keys
   * @default 'cache'
   */
  namespace?: string
}

interface CachedData<T> {
  data: T
  timestamp: number
  version: string
}

const CACHE_VERSION = '1.0'
const DEFAULT_SOFT_TTL = 1800 // 30 minutes in seconds
const DEFAULT_HARD_TTL = 1209600 // 14 days in seconds

/**
 * Generate a cache key from namespace and identifier
 */
function getCacheKey(namespace: string, identifier: string): string {
  return `${namespace}:${identifier}`
}

/**
 * Helper function to refresh cache in background (async, non-blocking)
 */
async function refreshInBackground<T>(
  identifier: string,
  fetcher: () => Promise<T>,
  cacheKey: string,
  hardTTL: number,
  client: Redis
): Promise<void> {
  try {
    const freshData = await fetcher()

    const cachedData: CachedData<T> = {
      data: freshData,
      timestamp: Date.now(),
      version: CACHE_VERSION
    }

    await client.set(cacheKey, JSON.stringify(cachedData), {
      ex: hardTTL
    })

    console.log(`✅ Background refresh completed for ${identifier}`)
  } catch (error) {
    // If refresh fails, old cache still exists (protected by hardTTL)
    console.error(`❌ Background refresh failed for ${identifier}:`, error)
    // Next request will try again, or keep serving stale cache
  }
}

/**
 * Format cache age for logging
 */
function formatAge(ageInSeconds: number): string {
  const days = Math.floor(ageInSeconds / 86400)
  const hours = Math.floor((ageInSeconds % 86400) / 3600)
  const minutes = Math.floor((ageInSeconds % 3600) / 60)

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m`
  return `${ageInSeconds}s`
}

/**
 * Wrapper function that implements Refresh-Ahead caching pattern
 *
 * Strategy (Refresh-Ahead Pattern):
 * 1. Check cache FIRST (before fetching)
 * 2. If cache exists:
 *    a. Check age against softTTL
 *    b. If fresh (age < softTTL): Return immediately
 *    c. If stale (age > softTTL): Return immediately + refresh in background
 * 3. If no cache: Fetch fresh data (user waits) and cache it
 * 4. On fetch error: Return stale cache if available (better than error)
 *
 * Benefits:
 * - Users ALWAYS get instant response (cache hit = 0 wait time)
 * - Stale cache is served while refreshing in background
 * - hardTTL (14 days) ensures cache persists during long outages
 * - softTTL controls freshness without blocking users
 */
export async function withRedisCache<T>(
  identifier: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const { softTTL = DEFAULT_SOFT_TTL, hardTTL = DEFAULT_HARD_TTL, namespace = 'cache' } = options

  const client = getRedisClient()

  // If Redis not configured or disabled, just fetch directly
  if (!client) {
    return await fetcher()
  }

  const cacheKey = getCacheKey(namespace, identifier)

  // Step 1: Try to get cache FIRST (Refresh-Ahead pattern)
  try {
    const cachedString = await client.get(cacheKey)

    if (cachedString) {
      const cachedData: CachedData<T> =
        typeof cachedString === 'string' ? JSON.parse(cachedString) : cachedString
      const ageInSeconds = Math.floor((Date.now() - cachedData.timestamp) / 1000)

      // Step 2: Check if cache is stale
      if (ageInSeconds > softTTL) {
        console.log(
          `⚡ Cache stale for ${identifier} (age: ${formatAge(ageInSeconds)}), refreshing in background`
        )

        // Step 3: Trigger background refresh (don't await - non-blocking!)
        refreshInBackground(identifier, fetcher, cacheKey, hardTTL, client).catch(() => {
          // Errors already logged in refreshInBackground
          // Just ensure no unhandled promise rejection
        })
      }

      // Step 4: Return cache immediately (stale or fresh, doesn't matter)
      return cachedData.data
    }
  } catch (cacheReadError) {
    console.error(`❌ Failed to read cache for ${cacheKey}:`, cacheReadError)
    // Fall through to fetch fresh data
  }

  // Step 5: No cache exists - fetch fresh data (user waits on first request)
  try {
    console.log(`🔄 No cache for ${identifier}, fetching fresh data`)
    const freshData = await fetcher()

    // Cache the fresh data
    try {
      const cachedData: CachedData<T> = {
        data: freshData,
        timestamp: Date.now(),
        version: CACHE_VERSION
      }

      await client.set(cacheKey, JSON.stringify(cachedData), {
        ex: hardTTL
      })
    } catch (cacheError) {
      // Log cache write errors but don't fail the request
      console.error(`❌ Failed to cache data for ${cacheKey}:`, cacheError)
    }

    return freshData
  } catch (fetchError) {
    // Step 6: Fetch failed - try to get ANY cache (even if expired by softTTL)
    console.error(`🚨 Fetch error for ${identifier}:`, fetchError)

    // Send error notification email (non-blocking)
    sendErrorEmail({
      errorType: 'cache-fetch',
      errorMessage: fetchError instanceof Error ? fetchError.message : String(fetchError),
      context: `Failed to fetch data for cache key (withRedisCache) with identifier: ${identifier}`,
      stack: fetchError instanceof Error ? fetchError.stack : undefined,
      metadata: {
        cacheKey: identifier,
        namespace,
        softTTL,
        hardTTL
      }
    })

    try {
      const cachedString = await client.get(cacheKey)

      if (cachedString) {
        const cachedData: CachedData<T> =
          typeof cachedString === 'string' ? JSON.parse(cachedString) : cachedString
        const ageInSeconds = Math.floor((Date.now() - cachedData.timestamp) / 1000)

        console.warn(
          `⚠️ Serving stale cache for ${identifier} due to fetch error (age: ${formatAge(ageInSeconds)})`
        )

        return cachedData.data
      }
    } catch (cacheReadError) {
      console.error(`❌ Failed to read cache for ${cacheKey}:`, cacheReadError)
    }

    // No cache available at all - throw the original error
    console.error(`💥 No cached data available for ${identifier}, throwing error`)
    throw fetchError
  }
}

/**
 * Invalidate cache for a specific key or pattern
 */
export async function invalidateCache(
  identifier: string,
  options: Pick<CacheOptions, 'namespace'> = {}
): Promise<void> {
  const { namespace = 'cache' } = options
  const client = getRedisClient()

  if (!client) {
    console.warn('⚠️ Redis not configured - cannot invalidate cache')
    return
  }

  const cacheKey = getCacheKey(namespace, identifier)

  try {
    await client.del(cacheKey)
    console.log(`🗑️ Invalidated cache: ${cacheKey}`)
  } catch (error) {
    console.error(`❌ Failed to invalidate cache for ${cacheKey}:`, error)
  }
}

/**
 * Get cache statistics for a specific key
 */
export async function getCacheInfo(
  identifier: string,
  options: Pick<CacheOptions, 'namespace'> = {}
): Promise<{
  exists: boolean
  age?: number
  ttl?: number
  version?: string
} | null> {
  const { namespace = 'cache' } = options
  const client = getRedisClient()

  if (!client) {
    return null
  }

  const cacheKey = getCacheKey(namespace, identifier)

  try {
    const [cachedString, ttl] = await Promise.all([client.get(cacheKey), client.ttl(cacheKey)])

    if (!cachedString) {
      return { exists: false }
    }

    const cachedData: CachedData<any> =
      typeof cachedString === 'string' ? JSON.parse(cachedString) : cachedString
    const ageInSeconds = Math.floor((Date.now() - cachedData.timestamp) / 1000)

    return {
      exists: true,
      age: ageInSeconds,
      ttl: ttl > 0 ? ttl : undefined,
      version: cachedData.version
    }
  } catch (error) {
    console.error(`❌ Failed to get cache info for ${cacheKey}:`, error)
    return null
  }
}

/**
 * Clear all cache entries in a namespace
 * WARNING: This can be slow for large datasets
 */
export async function clearNamespace(namespace: string = 'cache'): Promise<number> {
  const client = getRedisClient()

  if (!client) {
    console.warn('⚠️ Redis not configured - cannot clear namespace')
    return 0
  }

  try {
    // Note: SCAN is used instead of KEYS for better performance
    const pattern = `${namespace}:*`
    const keys: string[] = []
    let cursor: string | number = 0

    do {
      const result: [string | number, string[]] = await client.scan(cursor, {
        match: pattern,
        count: 100
      })
      cursor = result[0]
      keys.push(...result[1])
    } while (cursor !== 0 && cursor !== '0')

    if (keys.length === 0) {
      console.log(`ℹ️ No keys found in namespace: ${namespace}`)
      return 0
    }

    await client.del(...keys)
    console.log(`🗑️ Cleared ${keys.length} keys from namespace: ${namespace}`)
    return keys.length
  } catch (error) {
    console.error(`❌ Failed to clear namespace ${namespace}:`, error)
    return 0
  }
}
