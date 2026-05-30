import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('blocked_dates')
    .select('id, date, reason')
    .order('date', { ascending: true })
  return NextResponse.json(data || [])
}

export async function POST(request: NextRequest) {
  const { date, reason } = await request.json()
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 })
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blocked_dates')
    .upsert({ date, reason: reason || null }, { onConflict: 'date' })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
