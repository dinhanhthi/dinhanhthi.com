import { supabase } from './supabase'
import type { Stuff } from './types/stuff'

export async function getStuff({
  limit = 30,
  page = 1,
  tag,
  search
}: {
  limit?: number
  page?: number
  tag?: string
  search?: string
} = {}): Promise<{ stuff: Stuff[]; totalCount: number }> {
  try {
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('stuffs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    // Filter by tag
    if (tag) {
      query = query.contains('tags', [tag])
    }

    // Full-text search using PostgreSQL's tsvector
    if (search && search.trim()) {
      // Use textSearch for the search_vector column
      query = query.textSearch('search_vector', search.trim(), {
        type: 'websearch',
        config: 'english'
      })
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching stuff:', error)
      return { stuff: [], totalCount: 0 }
    }

    return {
      stuff: data || [],
      totalCount: count || 0
    }
  } catch (error) {
    console.error('Error in getStuff:', error)
    return { stuff: [], totalCount: 0 }
  }
}
