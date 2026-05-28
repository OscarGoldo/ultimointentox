import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Delete studies linked to this patient first
    await supabase.from('studies').delete().eq('patient_id', id)

    // Get appointment IDs to delete their studies too
    const { data: appts } = await supabase
      .from('appointments')
      .select('id')
      .eq('patient_id', id)

    if (appts?.length) {
      const apptIds = appts.map(a => a.id)
      await supabase.from('studies').delete().in('appointment_id', apptIds)
      await supabase.from('appointments').delete().in('id', apptIds)
    }

    // Now delete the patient
    const { error } = await supabase.from('patients').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('patients')
      .update(body)
      .eq('id', id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
