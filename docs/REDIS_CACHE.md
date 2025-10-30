# Redis Cache Architecture

> **Refresh-Ahead Pattern with Upstash Redis for optimal performance and reliability.**

---

## Overview

This project uses **Redis caching layer** with **Refresh-Ahead Pattern** to:
- Reduce load on Notion API (rate limits & network latency)
- Speed up responses (instant cache hits)
- Improve reliability (serve stale cache when Notion API fails)
- Enable Next.js ISR (Incremental Static Regeneration)

**Provider**: [Upstash Redis](https://upstash.com/) (serverless Redis with REST API)

---

## How It Works

### Refresh-Ahead Pattern

**Two TTL Strategy:**
- **softTTL**: When cache becomes "stale" and needs background refresh
- **hardTTL**: When Redis actually deletes the key (safety net, 30 days)

**Flow:**

```
Request → Check Redis Cache
          ↓
    ┌─────┴─────┐
  Found      Not Found
    ↓            ↓
Check Age    Fetch Fresh
    ↓            ↓
┌───┴───┐    Cache It
│       │
Fresh  Stale
│       │
Return  Return + Background Refresh
```

**Example:**

```typescript
// User requests homepage
const posts = await getPosts()

// Behind the scenes:
// 1. Check Redis: key = "notion:posts-{...filter...}"
// 2. Found cache (age = 7h, softTTL = 6h) → STALE
// 3. Return immediately to user (instant!)
// 4. Background: Fetch fresh data from Notion
// 5. Update Redis cache
// 6. Next request gets fresh data
```

---

## Configuration

### TTL Values (`src/lib/config.ts`)

```typescript
export const redisCacheTTL = {
  posts: { softTTL: 6 * HOUR, hardTTL: 30 * DAY },
  topics: { softTTL: 2 * DAY, hardTTL: 30 * DAY },
  books: { softTTL: 2 * DAY, hardTTL: 30 * DAY },
  tools: { softTTL: 2 * DAY, hardTTL: 30 * DAY },
  recordMap: { softTTL: 1 * HOUR, hardTTL: 30 * DAY },
  blocks: { softTTL: 3 * HOUR, hardTTL: 30 * DAY },
  emoji: { softTTL: 2 * DAY, hardTTL: 30 * DAY }
}
```

**Guidelines:**
- Frequently updated content → Short softTTL (1-6 hours)
- Stable content (taxonomy, tools) → Long softTTL (2 days)
- Always keep hardTTL long (30 days) as safety net

### Redis Client (`src/lib/redis-cache.ts`)

```typescript
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
  cache: 'force-cache'  // ⚡ Enables ISR with Redis
})
```

**Important**: `cache: 'force-cache'` allows Next.js to pre-render pages at build time while using Redis cache.

---

## Cache Keys

**Pattern**: `{namespace}:{identifier}`

**Examples:**
```
notion:posts-{"filter":{...},"pageSize":6}
notion:topics
notion:unofficial-books
notion:page-{pageId}
```

**Why JSON in key?** Each unique query (filter, pageSize) gets its own cache.

---

## Cached Functions

All functions in `src/lib/fetcher.ts` are wrapped with `withRedisCache()`:

| Function | Cache Key | softTTL |
|----------|-----------|---------|
| `getPosts()` | `posts-{query}` | 6h |
| `getUnofficialPosts()` | `unofficial-posts` | 6h |
| `getTopics()` | `topics` | 2d |
| `getUnofficialBooks()` | `unofficial-books` | 2d |
| `getUnofficialTools()` | `unofficial-tools` | 2d |
| `getRecordMap()` | `page-{pageId}` | 1h |

---

## ISR Integration

### Before (Dynamic Rendering)

```typescript
export const dynamic = 'force-dynamic'  // ❌ Slow - renders every request
export const revalidate = 60
```

### After (ISR + Redis)

```typescript
export const revalidate = 60  // ✅ Fast - static generation + periodic refresh

// Build time: Generate static HTML (uses Redis cache)
// Runtime: Serve static HTML from CDN (instant!)
// After 60s: Regenerate in background (uses Redis cache)
```

**Pages using ISR:**
- `/` (Homepage) - ○ Static
- `/notes`, `/tools`, `/reading`, `/tags` - ○ Static
- `/blogs`, `/tag/[slug]`, `/note/[slug]` - ƒ Dynamic (but cached)

---

## Cache Management

### Warm Cache

```bash
# After deployment (automated via GitHub Actions)
pnpm run warm-cache

# Or via API
curl -X POST https://dinhanhthi.com/api/cron/warm-cache \
  -H "Authorization: Bearer YOUR_SECRET"
```

### Clear Cache

```bash
pnpm run clear-cache --all
pnpm run clear-cache --key "notion:posts"
```

### Force Refresh in Code

```typescript
const posts = await getPosts({
  filter: {...},
  forceRefresh: true  // Skip cache, fetch fresh
})
```

---

## Monitoring

Console logs show cache activity:

```bash
⚪ Starting withRedisCache for cacheKey: notion:topics
⚡ Cache stale (age: 7h 15m), refreshing in background
✅ Background refresh completed
🔄 No cache, fetching fresh data
⚠️ Using stale cache due to fetch error
```

---

## Important Notes

### 1. Graceful Degradation

```typescript
// Cache auto-disables if:
// - No UPSTASH_REDIS_REST_URL configured
// - DISABLE_REDIS_CACHE=true

// App still works (fetches directly from Notion)
```

### 2. hardTTL is Never Reached

```
Timeline: 0h ──6h── 12h ──18h── 24h ────────── 30d
          │   │     │     │     │              │
        Create Stale Refresh Fresh           hardTTL
                 (bg)                    (never reached)
```

Because softTTL always refreshes before hardTTL expires!

### 3. Environment Variables

**Required:**
```bash
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

**Optional:**
```bash
DISABLE_REDIS_CACHE=true  # For testing
RESEND_API_KEY=re_...     # Error notifications
ADMIN_EMAIL=admin@...
DEPLOY_HOOK_SECRET=...    # Cache warming API
```

---

## Performance Impact

**Before (No Redis):**
- Homepage load: ~2-3s
- Notion API calls: 5-8 per request

**After (Redis + ISR):**
- Homepage load: ~200-500ms
- Notion API calls: 0 (served from cache/static)
- Cache miss: ~2-3s (only once per softTTL)

---

## Summary

✅ **Refresh-Ahead Pattern** ensures instant responses
✅ **Two TTL strategy** balances freshness vs performance
✅ **ISR integration** for static generation with fresh data
✅ **Graceful degradation** when Redis/Notion unavailable
✅ **Automatic background refresh** keeps cache up-to-date

**Result**: Fast, reliable, and less dependent on Notion API! 🚀

---

## References

- [Upstash Redis Docs](https://upstash.com/docs/redis)
- [Next.js ISR](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Refresh-Ahead Pattern](https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/refresh-ahead.html)
