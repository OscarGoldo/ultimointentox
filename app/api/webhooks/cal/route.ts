import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Cal.com sends webhook events for booking events
interface CalAttendee {
  name: string
  email: string
  timeZone?: string
}

interface CalBookingPayload {
  triggerEvent: string
  uid: string
  title?: string
  startTime?: string
  endTime?: string
  attendees?: CalAttendee[]
  metadata?: Record<string, string>
  responses?: Record<string, { value: string | string[] }>
  organizer?: { name: string; email: string }
}

export async function POST(request: NextRequest) {
  try {
    const body: CalBookingPayload = await request.json()

    // Only handle booking_created and booking_rescheduled
    const handledEvents = ['BOOKING_CREATED', 'BOOKING_RESCHEDULED', 'BOOKING_CONFIRMED']
    if (!handledEvents.includes(body.triggerEvent)) {
      return NextResponse.json({ received: true, skipped: true })
    }

    const supabase = await createClient()

    // Extract attendee info (first non-organizer attendee)
    const attendees = body.attendees || []
    const attendee = attendees[0]

    if (!attendee) {
      return NextResponse.json({ error: 'No attendee found' }, { status: 400 })
    }

    // Extract phone from responses or metadata
    const phone =
      (body.responses?.phone?.value as string) ||
      (body.responses?.phoneNumber?.value as string) ||
      (body.metadata?.phone) ||
      ''

    // Extract service type
    const serviceType =
      (body.responses?.motivo?.value as string) ||
      (body.responses?.serviceType?.value as string) ||
      (body.metadata?.serviceType) ||
      'ginecologia'

    // Parse start time
    const startTime = body.startTime ? new Date(body.startTime) : new Date()
    const appointmentDate = startTime.toISOString().split('T')[0]
    const appointmentTime = startTime.toTimeString().split(' ')[0].slice(0, 5)

    // Upsert patient
    const { data: existingPatient } = await supabase
      .from('patients')
      .select('id, total_visits, first_visit_date')
      .eq('email', attendee.email)
      .maybeSingle()

    let patientId: string

    if (existingPatient) {
      patientId = existingPatient.id
      // Update phone if we have it
      if (phone) {
        await supabase
          .from('patients')
          .update({ phone, name: attendee.name })
          .eq('id', patientId)
      }
    } else {
      // Create new patient
      const { data: newPatient, error: patientError } = await supabase
        .from('patients')
        .insert({
          name: attendee.name,
          email: attendee.email,
          phone: phone || null,
          first_visit_date: appointmentDate,
          total_visits: 0,
        })
        .select('id')
        .single()

      if (patientError || !newPatient) {
        return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 })
      }
      patientId = newPatient.id
    }

    const isFirstVisit = !existingPatient

    // Upsert appointment
    const appointmentData = {
      cal_booking_uid: body.uid,
      patient_id: patientId,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      service_type: serviceType,
      status: 'scheduled' as const,
      is_first_visit: isFirstVisit,
      cal_raw_data: body,
    }

    const { error: apptError } = await supabase
      .from('appointments')
      .upsert(appointmentData, { onConflict: 'cal_booking_uid' })

    if (apptError) {
      return NextResponse.json({ error: apptError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, patientId })
  } catch (err) {
    console.error('Cal webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
