/* eslint-disable @typescript-eslint/no-explicit-any */
import { searchNotion } from '@notion-x/src/lib/db'

import { BookmarkItem } from '../../../interface'

const UNOFFICIAL_NOTION_KEYS = {
  url: process.env.BOOKMARKS_URL_KEY as string,
  description: process.env.BOOKMARKS_DESC_KEY as string,
  coverUrl: process.env.BOOKMARKS_COVER_URL_KEY as string,
  boldSearchKey: `<${process.env.SEARCH_BOLD_KEY}>`,
  boldSearchKeyClose: `</${process.env.SEARCH_BOLD_KEY}>`
}

// Allow CORS for OPTIONS request
export async function OPTIONS(request: Request) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}

export async function POST(request: Request) {
  const searchParams = await request.json()

  const results = await searchNotion(
    searchParams,
    process.env.NOTION_API_WEB as string,
    process.env.NOTION_TOKEN_V2 as string,
    process.env.NOTION_ACTIVE_USER as string,
    process.env.DB_BOOKMARKS as string
  )
  const markResults = parseSearchResults(results)

  return new Response(JSON.stringify(markResults), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

function parseSearchResults(data: any): SearchResult[] {
  let results = [] as SearchResult[]
  if (!data || !data.results || data.results.length === 0) results = []
  else {
    for (const result of data.results) {
      const markId = result.id
      const _properties = data.recordMap?.block?.[markId]?.value?.properties
      const _title = _properties?.title?.[0]?.[0]
      const markTitle = _title || 'Untitled'
      const url = _properties?.[UNOFFICIAL_NOTION_KEYS.url]?.[0]?.[0] || null

      if (!url) continue

      const description = _properties?.[UNOFFICIAL_NOTION_KEYS.description]?.[0]?.[0] || null
      const coverUrl = _properties?.[UNOFFICIAL_NOTION_KEYS.coverUrl]?.[0]?.[0] || null
      const createdTime = data.recordMap?.block?.[markId]?.value?.created_time || null

      const titleHighlighted =
        result?.highlight?.title
          ?.replaceAll(UNOFFICIAL_NOTION_KEYS.boldSearchKey, '<span style="color: #000;">')
          ?.replaceAll(UNOFFICIAL_NOTION_KEYS.boldSearchKeyClose, '</span>') || markTitle
      const textHighlighted =
        result.highlight?.text
          ?.replaceAll(
            UNOFFICIAL_NOTION_KEYS.boldSearchKey,
            '<span style="color: #000; font-weight: 600;">'
          )
          ?.replaceAll(UNOFFICIAL_NOTION_KEYS.boldSearchKeyClose, '</span>') || null

      results.push({
        id: markId,
        title: markTitle,
        url,
        titleHighlighted,
        textHighlighted,
        description,
        coverUrl,
        createdTime
      })
    }
  }
  return results
}

type SearchResult = BookmarkItem & {
  titleHighlighted: string
  textHighlighted: string
  isFake?: boolean // used to not perform the request
}
