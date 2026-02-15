import { PostTypeOpts } from '@/src/app/components/PostsList'
import { PreviewImage } from 'notion-types'

import { cn } from './utils'

export const numPostsToShow = 12

export const defaultBlurDataURL =
  'data:image/webp;base64,UklGRu4CAABXRUJQVlA4WAoAAAAgAAAA+wAApwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggAAEAAHAPAJ0BKvwAqAA+7Xa3VqmnJSOgKAEwHYlpbt1fqZxA/IArN2vFych77iezf2IwQKTtQI/RqjOdjq6pcOr5lpldrCjSn5FYIDAK5T0+7vcmKybbL6g6tSn7tWOv2ZxfWQNgEU/JeCq/k9zzuPl8W5gNqTbm15NB3zOe+XPb6vkmRHm8AAD+7o9aHj3aLa14yWQgMZs8TuamPLH5rZylxChra4B5dWHgwOps5SFJeulgIDP3UYKDX745YTtU1tek9VoKCM1AtUiD8IcS+R9XAhJ4zdKfFy6pI6GocwBeHqw2Ccx6spAjE6DfRuYxQAa1Low2YbwG8MRsesGFW6AAAAA='

export const defaultCustomPreviewImage: PreviewImage = {
  originalWidth: 252,
  originalHeight: 168,
  dataURIBase64: defaultBlurDataURL
}

export const defaultPostTitle = 'Untitled'

export const defaultPostDate = new Date().toISOString().split('T')[0]

export const defaultPostTypeOpts: PostTypeOpts = {
  fontClassName: 'font-sans text-[0.95rem]',
  newLabel: 'new',
  updatedLabel: 'updated',
  humanizeDate: true,
  maxDaysWinthin: 14,
  autoHideAddedDate: true,
  hideOldDate: true
}

export const sectionOuterClass = cn('border-border-muted bg-bg overflow-hidden rounded-lg border')

export const postSimpleListContainerClass = cn(
  'divide-border-muted flex flex-col divide-y overflow-hidden',
  sectionOuterClass
)

export const postFontClassName = 'font-quicksand'

// ============================================================================
// ERROR NOTIFICATIONS CONFIGURATION
// ============================================================================

export const errorNotificationsConfig = {
  rateLimitMs: process.env.ERROR_NOTIFICATIONS_RATE_LIMIT_MS
    ? parseInt(process.env.ERROR_NOTIFICATIONS_RATE_LIMIT_MS)
    : 6 * 60 * 60 * 1000, // 6 hours - per error type
  globalRateLimitMs: process.env.ERROR_NOTIFICATIONS_GLOBAL_RATE_LIMIT_MS
    ? parseInt(process.env.ERROR_NOTIFICATIONS_GLOBAL_RATE_LIMIT_MS)
    : 6 * 60 * 60 * 1000, // 6 hours - global window
  globalMaxEmails: 1, // Max emails allowed within globalRateLimitMs window
  adminEmail: process.env.ADMIN_EMAIL ?? ''
}

// ============================================================================
// REDIS CACHE TTL CONFIGURATION
// ============================================================================

/**
 * Cache TTL (Time-To-Live) Configuration
 *
 * Two TTL Strategy (Refresh-Ahead Pattern):
 * - softTTL: When cache is considered "stale" and should refresh in BACKGROUND
 *            (user gets instant response, refresh happens async)
 * - hardTTL: When Redis actually DELETES the cache key
 *            (safety net for long Notion API outages)
 *
 * Guidelines:
 * - softTTL: Short for frequently updated content, long for stable data
 * - hardTTL: Always long (7-14 days) to survive API outages
 */

const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const FIXED_HARD_TTL = 30 * DAY

export const redisCacheTTL = {
  /**
   * Posts cache (official Notion DB API)
   * Updates frequently, needs fresh data
   */
  posts: {
    softTTL: 6 * HOUR,
    hardTTL: FIXED_HARD_TTL
  },

  /**
   * Unofficial posts cache (published Notion page)
   * Large dataset, less frequent updates
   */
  unofficialPosts: {
    softTTL: 6 * HOUR,
    hardTTL: FIXED_HARD_TTL
  },

  /**
   * Topics/Tags cache
   * Taxonomy rarely changes
   */
  topics: {
    softTTL: 2 * DAY,
    hardTTL: FIXED_HARD_TTL
  },

  /**
   * Books cache (reading list)
   * Stable collection, infrequent updates
   */
  books: {
    softTTL: 2 * DAY,
    hardTTL: FIXED_HARD_TTL
  },

  /**
   * Tools cache
   * Tool collection rarely changes
   */
  tools: {
    softTTL: 2 * DAY,
    hardTTL: FIXED_HARD_TTL
  },

  /**
   * Blocks cache (page content)
   * Content updates moderately
   */
  blocks: {
    softTTL: 3 * HOUR,
    hardTTL: FIXED_HARD_TTL
  },

  /**
   * Custom emoji cache
   * URLs almost never change
   */
  emoji: {
    softTTL: 2 * DAY,
    hardTTL: FIXED_HARD_TTL
  },

  /**
   * Record map cache
   * Page content changes moderately
   */
  recordMap: {
    softTTL: 1 * HOUR, // 1 hour - page content changes moderately
    hardTTL: FIXED_HARD_TTL
  }
} as const
