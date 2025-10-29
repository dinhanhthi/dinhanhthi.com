/**
 * Query Definitions - Single Source of Truth
 *
 * This file centralizes all Notion query parameters used across pages and cache warming.
 * When you modify a query here, all pages and warm-cache script automatically use the latest changes.
 *
 * ## Why This Exists
 * Previously, query parameters were duplicated across page components and warm-cache script.
 * If you changed the number of posts on a page, you had to manually update warm-cache too.
 * Now, there's ONE place to change query definitions, and everything stays in sync.
 *
 * ## Usage in pages:
 * ```typescript
 * import { queryDefinitions } from '@/src/lib/query-definitions'
 * const { pageSize, filter } = queryDefinitions.homePage.blogPosts
 * const posts = await getPosts({ pageSize, filter, whoIsCalling: '...' })
 * ```
 *
 * ## Usage in warm-cache script:
 * ```typescript
 * import { queryDefinitions } from '@/src/lib/query-definitions'
 * await getPosts({ ...queryDefinitions.homePage.blogPosts, whoIsCalling: '...', forceRefresh })
 * ```
 *
 * ## Example: Change Number of Blog Posts
 * **Before (had to change in 2 places):**
 * - src/app/page.tsx: `const numBlogPosts = 3` → `5`
 * - scripts/warm-cache.ts: `pageSize: 6` → `10`
 *
 * **After (change in 1 place only):**
 * - src/lib/query-definitions.ts: `pageSize: 3 * 2` → `5 * 2`
 * - ✨ All pages and warm-cache automatically updated!
 */

import { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints'

export type QueryDefinition = {
  pageSize?: number
  filter?: QueryDatabaseParameters['filter']
}

/**
 * Query definitions organized by page/feature
 */
export const queryDefinitions = {
  /**
   * HOME PAGE (/src/app/page.tsx)
   */
  homePage: {
    blogPosts: {
      pageSize: 3 * 2,
      filter: {
        property: 'blog',
        checkbox: {
          equals: true
        }
      }
    } as QueryDefinition,

    pinnedPosts: {
      pageSize: 6 * 2,
      filter: {
        and: [
          {
            property: 'pinned',
            checkbox: {
              equals: true
            }
          },
          {
            property: 'blog',
            checkbox: {
              equals: false
            }
          }
        ]
      }
    } as QueryDefinition,

    recentNotes: {
      pageSize: 12 * 2,
      filter: {
        property: 'blog',
        checkbox: {
          equals: false
        }
      }
    } as QueryDefinition
  },

  /**
   * NOTES PAGE (/src/app/(single-page)/notes/page.tsx)
   */
  notesPage: {
    pinnedPosts: {
      // No pageSize = get ALL pinned posts
      filter: {
        and: [
          {
            property: 'pinned',
            checkbox: {
              equals: true
            }
          },
          {
            property: 'blog',
            checkbox: {
              equals: false
            }
          }
        ]
      }
    } as QueryDefinition,

    blogPosts: {
      pageSize: 3 * 2,
      filter: {
        property: 'blog',
        checkbox: {
          equals: true
        }
      }
    } as QueryDefinition,

    allNotes: {
      pageSize: 30 * 2,
      filter: {
        property: 'blog',
        checkbox: {
          equals: false
        }
      }
    } as QueryDefinition
  },

  /**
   * BLOGS PAGE (/src/app/(single-page)/blogs/[[...slug]]/page.tsx)
   */
  blogsPage: {
    allBlogs: {
      // No pageSize = get ALL blogs for pagination
      filter: {
        property: 'blog',
        checkbox: {
          equals: true
        }
      }
    } as QueryDefinition
  },

  /**
   * TAG PAGE (/src/app/tag/[[...slug]]/page.tsx)
   *
   * Note: These are functions because they need the tag name parameter
   */
  tagPage: {
    /**
     * Get all posts by tag (for calculating total pages)
     */
    allPostsByTag: (tagName: string): QueryDefinition => ({
      // No pageSize = get ALL posts for this tag
      filter: {
        property: 'tags',
        multi_select: {
          contains: tagName
        }
      }
    }),

    /**
     * Get regular posts by tag (notes, not blogs)
     */
    regularPostsByTag: (tagName: string): QueryDefinition => ({
      pageSize: 48 * 2,
      filter: {
        and: [
          {
            property: 'tags',
            multi_select: {
              contains: tagName
            }
          },
          {
            property: 'blog',
            checkbox: {
              equals: false
            }
          }
        ]
      }
    }),

    /**
     * Get blog posts by tag
     */
    blogPostsByTag: (tagName: string): QueryDefinition => ({
      pageSize: 4 * 2,
      filter: {
        and: [
          {
            property: 'tags',
            multi_select: {
              contains: tagName
            }
          },
          {
            property: 'blog',
            checkbox: {
              equals: true
            }
          }
        ]
      }
    })
  }
} as const

/**
 * Helper function to get query definition with type safety
 */
export function getQueryDefinition<T extends keyof typeof queryDefinitions>(
  page: T,
  query: keyof (typeof queryDefinitions)[T]
): QueryDefinition {
  return queryDefinitions[page][query] as QueryDefinition
}
