import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  try {
    const { date, amount, category, description } = await request.json()
    if (!date || !amount) return NextResponse.json({ error: 'date y amount requeridos' }, { status: 400 })
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('expenses')
      .insert({ date, amount: Number(amount), category: category || 'otros', description: description || null })
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
