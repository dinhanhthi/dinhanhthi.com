import { makeSlugText } from '@/src/lib/helpers'
import { searchNotionPersonal } from '@/src/lib/notion/db'
import { SearchResult } from '@/src/lib/types'

const UNOFFICIAL_NOTION_KEYS = {
  slug: process.env.NEXT_PUBLIC_ID_SLUG as string,
  published: process.env.NEXT_PUBLIC_ID_PUBLISHED as string,
  title: 'title',
  boldSearchKey: `<${process.env.SEARCH_BOLD_KEY}>`,
  boldSearchKeyClose: `</${process.env.SEARCH_BOLD_KEY}>`,
  hide: process.env.NEXT_PUBLIC_ID_HIDE as string
}

const defaultPostTitle = 'Untitled'

// Allow CORS for OPTIONS request
export async function OPTIONS(_request: Request) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}

export async function POST(request: Request) {
  const startTime = Date.now()
  console.log('[Search API] ========== START ==========')

  try {
    // Step 1: Parse request body
    console.log('[Search API] Step 1: Parsing request body...')
    const searchParams = await request.json()
    console.log('[Search API] Step 1: Query:', searchParams.query)

    // Step 2: Check environment variables
    console.log('[Search API] Step 2: Checking environment variables...')
    const apiUrl = process.env.NOTION_API_PUBLISHED
    const dbId = process.env.NOTION_DB_POSTS
    // Debug: List all NOTION-related env vars (keys only, not values for security)
    const notionEnvKeys = Object.keys(process.env).filter(key => key.includes('NOTION'))
    console.log('[Search API] Step 2: Available NOTION env keys:', notionEnvKeys)
    console.log('[Search API] Step 2: NOTION_API_PUBLISHED:', apiUrl ? `${apiUrl.slice(0, 30)}...` : 'NOT SET')
    console.log('[Search API] Step 2: NOTION_DB_POSTS:', dbId ? `${dbId.slice(0, 10)}...` : 'NOT SET')

    if (!apiUrl) {
      throw new Error('NOTION_API_PUBLISHED environment variable is not set')
    }
    if (!dbId) {
      throw new Error('NOTION_DB_POSTS environment variable is not set')
    }

    // Step 3: Call Notion search API
    console.log('[Search API] Step 3: Calling searchNotionPersonal...')
    const results = await searchNotionPersonal(searchParams, apiUrl, dbId)
    console.log('[Search API] Step 3: Raw results received, results count:', results?.results?.length ?? 0)
    console.log('[Search API] Step 3: Has recordMap:', !!results?.recordMap)

    // Step 4: Parse results
    console.log('[Search API] Step 4: Parsing search results...')
    const postResults = parseSearchResults(results)
    console.log('[Search API] Step 4: Parsed results count:', postResults.length)

    // Step 5: Return response
    const duration = Date.now() - startTime
    console.log(`[Search API] Step 5: Returning response (took ${duration}ms)`)
    console.log('[Search API] ========== END ==========')

    return new Response(JSON.stringify(postResults), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`[Search API] ERROR (after ${duration}ms):`, error)
    console.error('[Search API] Error name:', error instanceof Error ? error.name : 'Unknown')
    console.error('[Search API] Error message:', error instanceof Error ? error.message : String(error))
    console.error('[Search API] Error stack:', error instanceof Error ? error.stack : 'No stack')
    console.log('[Search API] ========== END (ERROR) ==========')

    return new Response(JSON.stringify({ error: 'Search failed', details: String(error) }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

/**
 * We convert the format of search results got from /api/search-notion to the format we want
 * Note that: /api/search-notin uses an unofficial notion api, so the format is a little bit different
 */
function parseSearchResults(data: any): SearchResult[] {
  console.log('[parseSearchResults] Starting to parse...')
  console.log('[parseSearchResults] Input data type:', typeof data)
  console.log('[parseSearchResults] Input data keys:', data ? Object.keys(data) : 'null')

  let results = [] as SearchResult[]
  if (!data || !data.results || data.results.length === 0) {
    console.log('[parseSearchResults] No results found in data')
    results = []
  } else {
    console.log('[parseSearchResults] Processing', data.results.length, 'results...')

    for (const result of data.results) {
      const postId = result.id
      const _properties = data.recordMap?.block?.[postId]?.value?.properties

      if (!_properties) {
        console.log(`[parseSearchResults] No properties found for post ${postId}`)
        continue
      }

      const isPostPublished = _properties?.[UNOFFICIAL_NOTION_KEYS.published]?.[0]?.[0] === 'Yes'
      const isPostHide = _properties?.[UNOFFICIAL_NOTION_KEYS.hide]?.[0]?.[0] === 'Yes'
      const _title = _properties?.[UNOFFICIAL_NOTION_KEYS.title]?.[0]?.[0]
      const postTitle = _title || defaultPostTitle
      const _slug = _properties?.[UNOFFICIAL_NOTION_KEYS.slug]?.[0]?.[0] || null
      const postSlug = _slug || makeSlugText(_title || '')
      const postTitleHighlighted =
        result?.highlight?.title
          ?.replaceAll(UNOFFICIAL_NOTION_KEYS.boldSearchKey, `<span class="text-yellow-text-dark">`)
          ?.replaceAll(UNOFFICIAL_NOTION_KEYS.boldSearchKeyClose, `</span>`) || postTitle
      const postTextHighlighted =
        result.highlight?.text
          ?.replaceAll(UNOFFICIAL_NOTION_KEYS.boldSearchKey, `<span class="text-yellow-text-dark">`)
          ?.replaceAll(UNOFFICIAL_NOTION_KEYS.boldSearchKeyClose, `</span>`) || null

      if (isPostHide) {
        console.log(`[parseSearchResults] Skipping hidden post: ${postTitle}`)
        continue
      }
      if (process.env.NEXT_PUBLIC_ENV_MODE !== 'dev' && !isPostPublished) {
        console.log(`[parseSearchResults] Skipping unpublished post: ${postTitle}`)
        continue
      }

      results.push({
        id: postId,
        title: postTitle,
        slug: postSlug,
        isPublished: isPostPublished,
        titleHighlighted: postTitleHighlighted,
        textHighlighted: postTextHighlighted
      })
    }
  }

  console.log('[parseSearchResults] Final results count:', results.length)
  return results
}
