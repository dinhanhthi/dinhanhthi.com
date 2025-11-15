import { isAdmin } from '@/src/lib/auth'
import { getServerSupabase, supabase } from '@/src/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

type RouteParams = {
  params: Promise<{
    id: string
  }>
}

// GET - Fetch single stuff
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const { data, error } = await supabase.from('stuffs').select('*').eq('id', id).single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Stuff not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching stuff:', error)
    return NextResponse.json({ error: 'Failed to fetch stuff' }, { status: 500 })
  }
}

// PUT - Update stuff (admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { title, url, image_url, description, notes, tags } = body

    if (!title || !url) {
      return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 })
    }

    // Use service role client to bypass RLS
    const adminClient = getServerSupabase()
    const { data, error } = await adminClient
      .from('stuffs')
      .update({
        title,
        url,
        image_url: image_url || null,
        description: description || null,
        notes: notes || null,
        tags: tags || []
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating stuff:', error)
    return NextResponse.json({ error: 'Failed to update stuff' }, { status: 500 })
  }
}

// DELETE - Delete stuff (admin only)
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Use service role client to bypass RLS
    const adminClient = getServerSupabase()
    const { error } = await adminClient.from('stuffs').delete().eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting stuff:', error)
    return NextResponse.json({ error: 'Failed to delete stuff' }, { status: 500 })
  }
}
