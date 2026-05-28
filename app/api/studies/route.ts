import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const appointment_id = searchParams.get('appointment_id')
  const patient_id = searchParams.get('patient_id')

  const supabase = await createClient()
  let query = supabase.from('studies').select('*').order('created_at', { ascending: false })

  if (appointment_id) query = query.eq('appointment_id', appointment_id)
  else if (patient_id) query = query.eq('patient_id', patient_id)
  else return NextResponse.json({ error: 'appointment_id or patient_id required' }, { status: 400 })

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { appointment_id, patient_id, name, description, file_url, file_name } = body

    if (!patient_id || !name) {
      return NextResponse.json({ error: 'patient_id y name son requeridos' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('studies')
      .insert({ appointment_id: appointment_id || null, patient_id, name, description: description || null, file_url: file_url || null, file_name: file_name || null })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
