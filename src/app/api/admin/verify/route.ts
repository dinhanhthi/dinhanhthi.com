import { isAdmin } from '@/src/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const admin = await isAdmin()

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ success: true })
}
