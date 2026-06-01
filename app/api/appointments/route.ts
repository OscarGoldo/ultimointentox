import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface AppointmentBody {
  name: string
  cedula?: string
  phone?: string
  email?: string
  appointment_date: string
  appointment_time: string
  service_type?: string
  is_first_visit?: boolean
  notes?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: AppointmentBody = await request.json()

    if (!body.name || !body.appointment_date) {
      return NextResponse.json(
        { error: 'name y appointment_date son requeridos' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Find existing patient by cedula, email or phone
    let patientId: string | null = null

    if (body.cedula) {
      const { data } = await supabase
        .from('patients')
        .select('id')
        .eq('cedula', body.cedula)
        .maybeSingle()
      if (data) patientId = data.id
    }

    if (!patientId && body.email) {
      const { data } = await supabase
        .from('patients')
        .select('id')
        .eq('email', body.email)
        .maybeSingle()
      if (data) patientId = data.id
    }

    if (!patientId && body.phone) {
      const { data } = await supabase
        .from('patients')
        .select('id')
        .eq('phone', body.phone)
        .maybeSingle()
      if (data) patientId = data.id
    }

    if (patientId) {
      await supabase
        .from('patients')
        .update({
          name: body.name,
          ...(body.cedula ? { cedula: body.cedula } : {}),
          ...(body.phone ? { phone: body.phone } : {}),
          ...(body.email ? { email: body.email } : {}),
        })
        .eq('id', patientId)
    } else {
      // Create new patient
      const { data: newPatient, error: patientError } = await supabase
        .from('patients')
        .insert({
          name: body.name,
          cedula: body.cedula || null,
          phone: body.phone || null,
          email: body.email || null,
          first_visit_date: body.is_first_visit ? body.appointment_date : null,
          total_visits: 0,
        })
        .select('id')
        .single()

      if (patientError || !newPatient) {
        return NextResponse.json({ error: 'Error al crear paciente' }, { status: 500 })
      }
      patientId = newPatient.id
    }

    // Create appointment
    const { data: appointment, error: apptError } = await supabase
      .from('appointments')
      .insert({
        patient_id: patientId,
        appointment_date: body.appointment_date,
        appointment_time: body.appointment_time,
        service_type: body.service_type || 'ginecologia',
        status: 'confirmed',
        is_first_visit: body.is_first_visit ?? false,
        notes: body.notes || null,
      })
      .select('*, patient:patients(*)')
      .single()

    if (apptError) {
      return NextResponse.json({ error: apptError.message }, { status: 500 })
    }

    return NextResponse.json(appointment, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
