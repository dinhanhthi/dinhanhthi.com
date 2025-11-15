import { isAdmin } from '@/src/lib/auth'
import { getServerSupabase, supabase } from '@/src/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

const ITEMS_PER_PAGE = 30

// GET - Fetch stuff with pagination and search
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')

    const from = (page - 1) * ITEMS_PER_PAGE
    const to = from + ITEMS_PER_PAGE - 1

    let query = supabase
      .from('stuffs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    // Filter by tag if provided
    if (tag) {
      query = query.contains('tags', [tag])
    }

    // Full-text search
    if (search && search.trim()) {
      query = query.textSearch('search_vector', search.trim(), {
        type: 'websearch',
        config: 'english'
      })
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      stuff: data,
      totalCount: count,
      page,
      totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE)
    })
  } catch (error) {
    console.error('Error fetching stuff:', error)
    return NextResponse.json({ error: 'Failed to fetch stuff' }, { status: 500 })
  }
}

// POST - Create new stuff (admin only)
export async function POST(request: NextRequest) {
  try {
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, url, image_url, description, notes, tags } = body

    if (!title || !url) {
      return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 })
    }

    // Use service role client to bypass RLS
    const adminClient = getServerSupabase()
    const { data, error } = await adminClient
      .from('stuffs')
      .insert([
        {
          title,
          url,
          image_url: image_url || null,
          description: description || null,
          notes: notes || null,
          tags: tags || []
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating stuff:', error)
    return NextResponse.json({ error: 'Failed to create stuff' }, { status: 500 })
  }
}
