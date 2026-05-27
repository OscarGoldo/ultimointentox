import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AppointmentStatus, PaymentMethod } from '@/lib/types'

interface StatusBody {
  status: AppointmentStatus
  revenue?: number
  payment_method?: PaymentMethod
  payment_notes?: string
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: StatusBody = await request.json()

    if (!body.status) {
      return NextResponse.json({ error: 'status is required' }, { status: 400 })
    }

    const validStatuses: AppointmentStatus[] = [
      'scheduled',
      'confirmed',
      'completed',
      'no_show',
      'cancelled',
    ]
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const supabase = await createClient()

    const updateData: Record<string, unknown> = {
      status: body.status,
    }

    if (body.status === 'completed') {
      if (body.revenue !== undefined) updateData.revenue = body.revenue
      if (body.payment_method) updateData.payment_method = body.payment_method
      if (body.payment_notes !== undefined) updateData.payment_notes = body.payment_notes
    }

    const { data, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .select('*, patient:patients(*)')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update patient last_visit_date and total_visits if completed
    if (body.status === 'completed' && data.patient_id) {
      const { data: patient } = await supabase
        .from('patients')
        .select('total_visits, last_visit_date')
        .eq('id', data.patient_id)
        .single()

      if (patient) {
        const shouldUpdateDate =
          !patient.last_visit_date ||
          data.appointment_date > patient.last_visit_date

        await supabase
          .from('patients')
          .update({
            total_visits: (patient.total_visits || 0) + 1,
            ...(shouldUpdateDate ? { last_visit_date: data.appointment_date } : {}),
          })
          .eq('id', data.patient_id)
      }
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
