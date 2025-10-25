# Redis Cache Setup Guide

This guide provides step-by-step instructions for setting up Redis caching with Upstash for your Next.js application. The cache layer ensures users always see content (even stale cached data) when Notion API errors occur, while errors are logged for monitoring.

## Table of Contents

1. [Overview](#overview)
2. [Local Development Setup](#local-development-setup)
3. [Production Setup (Vercel)](#production-setup-vercel)
4. [How It Works](#how-it-works)
5. [Cache Management](#cache-management)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)

---

## Overview

### What Was Changed

The application now uses **Upstash Redis** as a cache layer for all Notion API calls:

- **New file**: `src/lib/redis-cache.ts` - Core caching logic
- **Updated**: `src/lib/fetcher.ts` - All data fetching functions now use Redis cache
- **Updated**: `src/lib/notion/db.ts` - Block fetching uses Redis cache
- **Updated**: `example.env.local` - Added Redis configuration

### Benefits

1. **Zero Downtime for Users**: When Notion API fails, users see cached data instead of errors
2. **Better Performance**: Frequently accessed data is served from Redis (faster than Notion API)
3. **Cost Optimization**: Reduces Notion API calls
4. **Error Visibility**: Errors are logged for you to monitor, but hidden from users

### Cache Strategy

```
┌─────────────────────────────────────────────────────────────┐
│ User Request                                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Try to fetch fresh data from Notion API                    │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    ✅ Success              ❌ Error
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────────┐
│ Cache in Redis  │    │ Try Redis Cache      │
│ Return fresh    │    │                      │
│ data to user    │    │  ┌──────────────────┐│
└─────────────────┘    │  │ Found? Return it ││
                       │  │ (even if stale)  ││
                       │  └────────┬─────────┘│
                       │           │          │
                       │      ┌────┴─────┐   │
                       │      │ Not      │   │
                       │      │ Found?   │   │
                       │      │ Throw    │   │
                       │      │ Error    │   │
                       │      └──────────┘   │
                       └──────────────────────┘
```

---

## Local Development Setup

### Step 1: Install Dependencies

```bash
pnpm install @upstash/redis
```

**Latest Version** (as of Oct 2025): `@upstash/redis@1.34.3`

### Step 2: Create Upstash Account

1. Go to [Upstash Console](https://console.upstash.com/)
2. Sign up for free account (GitHub/Google login available)
3. **Free Tier Includes**:
   - 10,000 commands per day
   - 256 MB storage
   - TLS encryption
   - Perfect for development and small sites

### Step 3: Create Redis Database

1. In Upstash Console, click **"Create Database"**
2. Configure your database:
   - **Name**: `dinhanhthi-dev` (or any name you prefer)
   - **Type**: Regional (faster) or Global (better availability)
   - **Region**: Choose closest to your Vercel deployment region
     - For US: `us-east-1` or `us-west-1`
     - For EU: `eu-west-1`
     - For Asia: `ap-southeast-1`
   - **Eviction**: Choose `noeviction` (recommended) or `allkeys-lru`
3. Click **"Create"**

### Step 4: Get Redis Credentials

1. After database is created, you'll see the database dashboard
2. Scroll down to **"REST API"** section
3. Copy the following values:
   - `UPSTASH_REDIS_REST_URL` (looks like: `https://xxx-xxxxx.upstash.io`)
   - `UPSTASH_REDIS_REST_TOKEN` (long string starting with `AX...`)

### Step 5: Configure Local Environment

1. Copy `example.env.local` to `.env.local` (if you haven't already):
   ```bash
   cp example.env.local .env.local
   ```

2. Edit `.env.local` and add your Redis credentials:
   ```bash
   # ---- REDIS CACHE (UPSTASH)
   UPSTASH_REDIS_REST_URL="https://your-actual-url.upstash.io"
   UPSTASH_REDIS_REST_TOKEN="AXyourActualTokenHere"
   ```

### Step 6: Test Local Setup

1. Start the development server:
   ```bash
   pnpm run dev
   ```

2. Visit `http://localhost:3004` in your browser

3. Check the console logs - you should see cache-related logs:
   ```
   ✅ Cached data: notion:topics (TTL: 7200s)
   ✅ Cached data: notion:unofficial-posts (TTL: 3600s)
   ```

4. Refresh the page - data should load faster (from cache)

### Step 7: Verify Cache in Upstash Console

1. Go back to Upstash Console
2. Click on your database
3. Go to **"Data Browser"** tab
4. You should see keys like:
   - `notion:topics`
   - `notion:unofficial-posts`
   - `notion:posts-{...}`
   - `notion:blocks-{blockId}`

---

## Production Setup (Vercel)

### Step 1: Create Production Redis Database

**Option A: Use Same Database (Not Recommended)**
- You can use the same Upstash database for both dev and production
- Use namespaces to separate data (already configured in code)

**Option B: Create Separate Database (Recommended)**
1. In Upstash Console, create a new database:
   - **Name**: `dinhanhthi-prod`
   - **Type**: Global (for better availability across regions)
   - **Region**: Same as your Vercel deployment
2. Copy the new credentials

### Step 2: Configure Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

   | Variable Name | Value | Environment |
   |--------------|-------|-------------|
   | `UPSTASH_REDIS_REST_URL` | `https://your-prod-url.upstash.io` | Production |
   | `UPSTASH_REDIS_REST_TOKEN` | `AXyourProdTokenHere` | Production |

4. Optional: Add preview environment variables
   - Set same variables for **Preview** environment if you want caching on preview deployments

### Step 3: Deploy

1. Commit and push your changes:
   ```bash
   # Git operations are handled by you, not me
   # Just make sure to commit all the changes
   ```

2. Vercel will automatically deploy with the new environment variables

3. Check deployment logs for cache-related messages

### Step 4: Verify Production Cache

1. Visit your production site
2. Check Vercel function logs:
   - Go to Vercel Dashboard → Deployments → Select deployment → Functions
   - Look for cache logs in function invocations

2. Check Upstash Console:
   - Go to your production database
   - Monitor **"Metrics"** tab for request counts
   - Check **"Data Browser"** for cached keys

---

## How It Works

### Cache TTL (Time To Live) Settings

This project uses **Refresh-Ahead Pattern** with **two TTL values**: **softTTL** and **hardTTL**.

#### Understanding softTTL vs hardTTL

**softTTL** (Soft Time-To-Live):
- **What it is**: The time after which cache is considered "stale" but still usable
- **What happens**: Cache is returned **immediately** to the user, then refreshed in **background**
- **User experience**: Zero wait time - users always get instant response
- **Example**: If softTTL = 6 hours and user visits after 7 hours:
  1. User gets cached data instantly (even though it's "stale")
  2. System triggers background refresh (fetches new data from Notion API)
  3. Next user gets the freshly updated cache

**hardTTL** (Hard Time-To-Live):
- **What it is**: The absolute expiry time when Redis **deletes** the cache key
- **Purpose**: Safety net for long Notion API outages
- **What happens**: Redis automatically removes the cache after this duration
- **Example**: If hardTTL = 30 days:
  - Even if Notion API is down for 29 days, users still see cached content
  - After 30 days, cache is deleted and users will see errors if API is still down

#### Why We Need Both

**Without softTTL** (only hardTTL):
```
User request → Check cache → If old → ⏳ WAIT for Notion API → Return data
                                      ↑ User waits!
```

**With softTTL** (Refresh-Ahead Pattern):
```
User request → Check cache → If old → ✅ Return cache INSTANTLY + refresh in background
                                      ↑ User gets immediate response!
```

**Without hardTTL** (only softTTL):
- Stale cache could stay forever
- No cleanup mechanism
- Risk of serving very outdated content

**With hardTTL**:
- Guarantees cache freshness (max age = 30 days)
- Automatic cleanup
- Forces refresh if data is too old

#### Configuration

All TTL values are centralized in `src/lib/config.ts`:

| Data Type | Soft TTL | Hard TTL | Rationale |
|-----------|----------|----------|-----------|
| **Posts** | 6 hours | 30 days | Content updates moderately, longer softTTL for development quota |
| **Unofficial Posts** | 6 hours | 30 days | Large dataset, balanced refresh rate |
| **Books** | 2 days | 30 days | Reading list changes rarely |
| **Tools** | 2 days | 30 days | Tool collection is very stable |
| **Topics/Tags** | 2 days | 30 days | Taxonomy rarely changes |
| **Blocks** | 3 hours | 30 days | Page content updates moderately |
| **Emoji** | 1 day | 30 days | Emojis almost never change |

**Note**: All TTL values can be adjusted in `src/lib/config.ts` without touching individual files.

#### Timeline Example (Posts Cache)

```
Time 0:       User A visits → Fresh fetch from Notion → Cache stored

Time 5h:      User B visits → Cache age: 5h (< 6h softTTL)
              ✅ Return cache (fresh, no refresh needed)

Time 7h:      User C visits → Cache age: 7h (> 6h softTTL)
              ✅ Return cache INSTANTLY
              🔄 Trigger background refresh (non-blocking)

Time 7h+5s:   Background refresh completes → Cache updated

Time 8h:      User D visits → Gets the updated cache

...

Day 29:       Notion API down for maintenance
              Users still get cached content ✅

Day 31:       Cache deleted by Redis (hardTTL = 30 days)
              If Notion API still down → Users see errors ❌
```

#### Best Practices

- **softTTL**: Set based on how often your content updates
  - Frequently updated: 3-6 hours
  - Moderately updated: 6-12 hours
  - Rarely updated: 1-2 days

- **hardTTL**: Always long enough to survive typical outages
  - Recommended: 30 days (standard safety net)
  - Minimum: 7 days

- **Development**: Longer softTTL (6h) reduces API calls and saves development quota

### Cache Key Structure

All cache keys follow this pattern: `namespace:identifier`

**Namespace**: `notion` (all Notion-related data)

**Examples**:
- `notion:topics` - All topics
- `notion:unofficial-posts` - All unofficial posts
- `notion:posts-{JSON}` - Posts with specific filters (JSON-stringified options)
- `notion:blocks-{blockId}` - Blocks for a specific page
- `notion:emoji-{pageId}-{emojiId}` - Custom emoji URL

### Error Handling Flow

```typescript
try {
  // 1. Fetch fresh data from Notion API
  const freshData = await fetchFromNotion()

  // 2. Cache it in Redis
  await redis.set(key, freshData, { ex: ttl })

  // 3. Return fresh data
  return freshData

} catch (error) {
  // 4. Log error (you see this in logs)
  console.error('🚨 Fetch error:', error)

  // 5. Try to get cached data (even if expired)
  const cachedData = await redis.get(key)

  if (cachedData) {
    // 6. Return stale cache (users see content)
    console.warn('⚠️ Using stale cache')
    return cachedData
  }

  // 7. No cache available - throw error
  throw error
}
```

### Cache Without Redis

If Redis credentials are not configured:
- The app will still work normally
- A warning will be logged: `⚠️ Redis not configured - caching disabled`
- All requests will go directly to Notion API
- No fallback cache available on errors

---

## Cache Management

### Invalidating Cache

You can manually invalidate cache using the provided utility functions.

**Option 1: Invalidate Specific Key**

Create a script at `scripts/clear-cache.ts`:

```typescript
import { invalidateCache } from '@/src/lib/redis-cache'

async function main() {
  // Clear specific cache
  await invalidateCache('topics', { namespace: 'notion' })
  await invalidateCache('unofficial-posts', { namespace: 'notion' })

  console.log('✅ Cache cleared')
}

main()
```

**Option 2: Clear All Notion Cache**

Create a script at `scripts/clear-all-cache.ts`:

```typescript
import { clearNamespace } from '@/src/lib/redis-cache'

async function main() {
  // Clear all cache in 'notion' namespace
  const count = await clearNamespace('notion')
  console.log(`✅ Cleared ${count} cache entries`)
}

main()
```

**Option 3: Manually in Upstash Console**

1. Go to Upstash Console → Your Database
2. Click **"Data Browser"** tab
3. Search for keys by pattern (e.g., `notion:*`)
4. Click **"Delete"** on specific keys or **"Flush DB"** to clear all

### Cache Statistics

Check cache information programmatically:

```typescript
import { getCacheInfo } from '@/src/lib/redis-cache'

const info = await getCacheInfo('topics', { namespace: 'notion' })

console.log({
  exists: info?.exists,      // true if cache exists
  age: info?.age,            // Age in seconds
  ttl: info?.ttl,            // Remaining TTL in seconds
  version: info?.version     // Cache version
})
```

---

## Monitoring

### Development Monitoring

Check your terminal logs when running `pnpm run dev`:

**Success Logs**:
```
✅ Cached data: notion:topics (TTL: 7200s)
```

**Cache Hit Logs**:
```
⚠️ Using stale cache for topics (age: 45m)
```

**Error Logs**:
```
🚨 Fetch error for topics: Error: API rate limit exceeded
```

### Production Monitoring

#### 1. Vercel Function Logs

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Deployments** → Select deployment → **Functions**
4. Filter logs by error level
5. Look for:
   - `🚨 Fetch error` - API errors
   - `⚠️ Using stale cache` - Fallback to cache
   - `❌ Failed to cache` - Redis errors

#### 2. Upstash Monitoring

1. Go to Upstash Console → Your Database
2. Check **"Metrics"** tab:
   - **Commands/sec**: Request rate to Redis
   - **Hits**: Successful cache retrievals
   - **Misses**: Cache not found
   - **Hit Rate**: Percentage of requests served from cache
3. Set up **Alerts** (if needed):
   - Go to **"Alerts"** tab
   - Configure alerts for high error rates or memory usage

#### 3. Set Up Error Notifications (Optional)

To get notified when Notion API errors occur, integrate with error tracking:

**Option A: Sentry**
```bash
pnpm add @sentry/nextjs
```

**Option B: LogTail/BetterStack**
1. Sign up at [BetterStack Logs](https://logs.betterstack.com/)
2. Create a source for your app
3. Add to your code:
   ```typescript
   import { Logtail } from '@logtail/node'

   const logtail = new Logtail(process.env.LOGTAIL_TOKEN)

   // In redis-cache.ts catch block:
   logtail.error('Notion API error', { error, identifier })
   ```

---

## Troubleshooting

### Issue: "Redis not configured - caching disabled"

**Cause**: Environment variables are not set

**Solution**:
1. Check `.env.local` has correct values
2. Restart dev server: `pnpm run dev`
3. For Vercel: Check environment variables in Settings

### Issue: "Failed to cache data"

**Cause**:
- Redis connection error
- Invalid credentials
- Network issues

**Solution**:
1. Verify credentials in Upstash Console
2. Check database is active (not paused)
3. Test connection in Upstash Console → "CLI" tab:
   ```redis
   PING
   ```
   Should return `PONG`

### Issue: "No cached data available, throwing error"

**Cause**: API error occurred AND no cache exists yet

**Solution**:
This is expected on first deployment or after cache expiry. The cache will be populated on the next successful API call.

**Prevention**:
- Warm up cache after deployment:
  ```bash
  # Visit all important pages to populate cache
  curl https://your-site.com
  curl https://your-site.com/notes
  curl https://your-site.com/tags
  ```

### Issue: Stale data showing on site

**Cause**: TTL is too long OR cache not invalidated after content update

**Solution**:
1. **Quick fix**: Clear cache manually (see [Cache Management](#cache-management))
2. **Adjust TTL**: Edit TTL values in code if needed
3. **Set up webhook**: Create a Notion webhook to auto-invalidate cache on updates

### Issue: High Redis costs / approaching limits

**Cause**: Too many cache writes or very short TTL

**Solution**:
1. **Increase TTL** for stable data (topics, tools)
2. **Monitor usage** in Upstash Console → Metrics
3. **Upgrade plan** if needed (first 10K commands/day are free)
4. **Optimize cache keys** - reduce redundant caching

### Issue: Cache keys not showing in Upstash

**Cause**:
- Redis not configured properly
- No traffic to site yet
- Cache TTL already expired

**Solution**:
1. Verify environment variables
2. Visit your site to trigger cache population
3. Check immediately in Data Browser (before TTL expires)

---

## Cache Warming Strategy (Optional)

To ensure cache is always populated, set up a cache warming script:

**Create `scripts/warm-cache.ts`**:

```typescript
import { getTopics, getPosts, getUnofficialBooks, getUnofficialTools } from '@/src/lib/fetcher'

async function warmCache() {
  console.log('🔥 Warming up cache...')

  try {
    await Promise.all([
      getTopics(),
      getPosts({ pageSize: 100 }),
      getUnofficialBooks(),
      getUnofficialTools()
    ])

    console.log('✅ Cache warmed successfully')
  } catch (error) {
    console.error('❌ Cache warming failed:', error)
  }
}

warmCache()
```

**Add to `package.json`**:
```json
{
  "scripts": {
    "warm-cache": "tsx scripts/warm-cache.ts"
  }
}
```

**Run after deployment**:
```bash
pnpm run warm-cache
```

---

## Advanced Configuration

### Custom TTL per Environment

```typescript
// src/lib/redis-cache.ts
const getTTL = (baseTTL: number) => {
  if (process.env.ENV_MODE === 'dev') {
    return baseTime / 2  // Shorter cache in dev
  }
  return baseTTL
}
```

### Debug Mode

Enable debug logging for cache operations:

```typescript
// In your .env.local
REDIS_DEBUG=true
```

```typescript
// In redis-cache.ts
const debug = process.env.REDIS_DEBUG === 'true'

withRedisCache(key, fetcher, { debug })
```

---

## Deep Dive: hardTTL vs softTTL

### Overview

**Refresh-Ahead Pattern** uses **two TTL values** to balance freshness and reliability:

- **softTTL** (Refresh Threshold): When to refresh cache in background
- **hardTTL** (Deletion Time): When Redis removes cache (safety net)

### Key Concept

**hardTTL is NOT a normal expiration time!** It's a **safety net** that:
- Protects stale cache during outages
- Only triggers if background refresh fails repeatedly
- In normal operation, **never reached** (cache refreshes before hardTTL)

### Timeline Comparison

#### Scenario 1: Normal Operation (Notion API Healthy)

```
Topics cache (softTTL: 2h, hardTTL: 14 days)

Day 1, 00:00:00  ✅ Cache created (age: 0, fresh: true)
                 └─ hardTTL countdown starts (14d remaining)

Day 1, 02:00:00  ⏰ softTTL reached (age: 2h, fresh: false)
Day 1, 02:00:01  👤 User request
                 ├─ Return stale cache IMMEDIATELY (age: 2h)
                 └─ Background refresh triggered

Day 1, 02:00:05  ✅ Background refresh SUCCESS
                 ├─ Cache OVERWRITTEN with fresh data
                 ├─ age reset to 0
                 └─ hardTTL RESET (14d remaining again)

Day 1, 04:00:00  ⏰ softTTL reached again (age: 2h, fresh: false)
Day 1, 04:00:05  ✅ Background refresh SUCCESS → cache refreshed
                 └─ hardTTL RESET (14d remaining)

Day 1, 06:00:00  ⏰ softTTL reached again
Day 1, 06:00:05  ✅ Background refresh SUCCESS → cache refreshed
                 └─ hardTTL RESET (14d remaining)

... (cycle repeats every 2 hours)

❌ hardTTL NEVER REACHED (cache refreshes every 2h → 14d never comes)
```

#### Scenario 2: Notion API Down (hardTTL Protection)

```
Topics cache (softTTL: 2h, hardTTL: 14 days)

Day 1, 00:00:00  ✅ Cache created (age: 0, fresh: true)
                 └─ hardTTL countdown: 14d remaining

Day 1, 02:00:00  ⏰ softTTL reached (age: 2h, fresh: false)
Day 1, 02:00:01  👤 User request
                 ├─ Return stale cache IMMEDIATELY (age: 2h)
                 └─ Background refresh triggered

Day 1, 02:00:05  ❌ Background refresh FAILED (Notion API down)
                 ├─ Stale cache STILL EXISTS (not deleted)
                 ├─ age stays at 2h (no reset)
                 └─ hardTTL countdown: 13d 22h remaining

Day 1, 04:00:00  ⏰ softTTL reached again (age: 4h)
Day 1, 04:00:05  ❌ Background refresh FAILED
                 ├─ Stale cache STILL EXISTS
                 └─ hardTTL countdown: 13d 20h remaining

Day 1, 06:00:00  ⏰ softTTL reached again (age: 6h)
Day 1, 06:00:05  ❌ Background refresh FAILED
                 └─ hardTTL countdown: 13d 18h remaining

... (Notion API down for 14 days straight 😱)

Day 14, 23:59:59 ⚠️ hardTTL countdown: 1 second remaining
Day 15, 00:00:00 🗑️ hardTTL REACHED → Redis DELETES cache
Day 15, 00:00:01 👤 User request
                 ├─ No cache found
                 ├─ Try fetch from Notion → FAILED (still down)
                 └─ Return error to user (no stale cache available)
```

### Code Implementation

```typescript:95:133:src/lib/redis-cache.ts
async function backgroundRefresh<T>(
  identifier: string,
  fetcher: () => Promise<T>,
  softTTL: number,
  hardTTL: number
) {
  try {
    const freshData = await fetcher()
    // Save to cache with BOTH TTLs
    // - softTTL: when to refresh again
    // - hardTTL: when Redis deletes (if refresh keeps failing)
    await setCache(identifier, freshData, { softTTL, hardTTL })
    console.log(`✅ Background refresh completed: ${identifier}`)
  } catch (error) {
    // If refresh fails, old cache still exists (protected by hardTTL)
    console.error(`❌ Background refresh failed for ${identifier}:`, error)
    // Next request will try again, or keep serving stale cache
  }
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
): Promise<T>
```

### Real-World TTL Configuration

```typescript
// Fast-changing content
getPosts() → softTTL: 30m / hardTTL: 7d
- Refresh every 30 minutes
- Keep for 7 days during outage

// Moderate updates
getTopics() → softTTL: 2h / hardTTL: 14d
- Refresh every 2 hours
- Keep for 14 days during outage

// Stable content
getCustomEmojiUrl() → softTTL: 24h / hardTTL: 14d
- Refresh daily
- Keep for 14 days during outage
```

### Key Takeaways

1. **softTTL** = Refresh frequency (controls freshness)
   - Triggers background refresh
   - Cache is served immediately (no user wait)
   - Cache age resets to 0 after successful refresh

2. **hardTTL** = Safety net (controls reliability)
   - Only matters when background refresh fails repeatedly
   - In normal operation: **never reached** (cache refreshes before hardTTL)
   - Protects stale cache during long outages

3. **Cache Overwrite**:
   - Every successful background refresh → **overwrites** cache + **resets** TTL
   - Failed refresh → cache **remains** with same age + hardTTL countdown continues

4. **When hardTTL is reached**:
   - Redis deletes the cache
   - Next request has no fallback (error shown to user)
   - **This should rarely happen** (means API down for softTTL × many cycles)

### Visual Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Cache Lifecycle (Normal Operation)                         │
└─────────────────────────────────────────────────────────────┘

Cache Created ──┬──> softTTL reached ──> Background Refresh ──┐
  (age: 0)      │     (age: 2h)              SUCCESS         │
                │                               │             │
                │                               ▼             │
                │                        Cache OVERWRITTEN    │
                │                        age reset to 0       │
                └───────────────────────────────┬─────────────┘
                                                │
                                    (cycle repeats forever)
                                                │
                        hardTTL NEVER REACHED ──┘


┌─────────────────────────────────────────────────────────────┐
│ Cache Lifecycle (Outage Scenario)                          │
└─────────────────────────────────────────────────────────────┘

Cache Created ──> softTTL reached ──> Background Refresh
  (age: 0)         (age: 2h)              FAILED
                                            │
                                            ▼
                                    Cache STILL EXISTS
                                    age stays at 2h
                                    hardTTL: 13d 22h left
                                            │
                                            ▼
                            (requests keep serving stale cache)
                                            │
                                            ▼
                                    ... 14 days later ...
                                            │
                                            ▼
                                    hardTTL REACHED
                                    Redis DELETES cache
                                            │
                                            ▼
                                    Next request = ERROR
                                    (no fallback available)
```

## Summary

✅ **What you've accomplished**:
- Added Redis caching layer with Upstash
- Implemented fallback to stale cache on errors
- Zero downtime for users during API failures
- Comprehensive error logging for monitoring

📊 **Expected behavior**:
- Users always see content (fresh or cached)
- Errors logged but not shown to users
- Faster page loads (cached data)
- Reduced Notion API calls

🎯 **Next steps**:
1. Deploy to production
2. Monitor cache hit rates
3. Adjust TTL values based on your content update frequency
4. Set up cache warming for critical pages
