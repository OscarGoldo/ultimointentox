import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import nodemailer from 'nodemailer'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

const SERVICE_LABELS: Record<string, string> = {
  'control-prenatal': 'Control Prenatal',
  'ginecologia': 'Ginecología General',
  'fertilidad': 'Fertilidad / Reproducción',
  'planificacion': 'Planificación Familiar',
  'menopausia': 'Menopausia y Climaterio',
  'otro': 'Otro / Consulta general',
}

function formatTime(t: string) {
  const [h, m] = t.split(':')
  const hour = parseInt(h)
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`
}

async function sendEmails(opts: {
  patientName: string
  patientEmail: string
  date: string
  time: string
  service: string
}) {
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  if (!smtpUser || !smtpPass) {
    console.warn('SMTP_USER/SMTP_PASS not set — skipping email')
    return
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: smtpUser, pass: smtpPass },
  })

  const dateFormatted = format(parseISO(opts.date), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
  const timeFormatted = formatTime(opts.time)
  const serviceLabel = SERVICE_LABELS[opts.service] || opts.service

  // Email to patient
  if (opts.patientEmail) {
    await transporter.sendMail({
      from: `"Consultorio Dra. Hilda Díaz" <${smtpUser}>`,
      to: opts.patientEmail,
      subject: '✓ Cita confirmada — Dra. Hilda Díaz García',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px">
          <div style="background:#f06292;padding:20px 24px;border-radius:12px 12px 0 0">
            <h1 style="color:white;margin:0;font-size:20px">Cita confirmada ✓</h1>
          </div>
          <div style="background:#fafafa;padding:24px;border:1px solid #eee;border-top:none;border-radius:0 0 12px 12px">
            <p style="margin-top:0">Estimada <strong>${opts.patientName}</strong>,</p>
            <p>Su cita ha sido confirmada con la <strong>Dra. Hilda Mary Díaz García</strong>, Médico Especialista en Ginecología y Obstetricia.</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
              <tr><td style="padding:8px;background:#fff3f7;font-weight:bold;border-radius:4px 0 0 4px;width:40%">Fecha</td><td style="padding:8px;background:#fff3f7;border-radius:0 4px 4px 0;text-transform:capitalize">${dateFormatted}</td></tr>
              <tr><td style="padding:8px;font-weight:bold">Hora</td><td style="padding:8px">${timeFormatted}</td></tr>
              <tr><td style="padding:8px;background:#fff3f7;font-weight:bold;border-radius:4px 0 0 4px">Servicio</td><td style="padding:8px;background:#fff3f7;border-radius:0 4px 4px 0">${serviceLabel}</td></tr>
            </table>
            <p style="color:#666;font-size:13px">Para cancelar o reprogramar su cita, comuníquese con el consultorio con al menos 24 horas de anticipación.</p>
            <p style="color:#999;font-size:12px;margin-bottom:0">Maturín, Estado Monagas, Venezuela</p>
          </div>
        </div>
      `,
    })
  }

  // Notification to doctor
  await transporter.sendMail({
    from: `"Sistema de citas" <${smtpUser}>`,
    to: 'hildadiaz.69@gmail.com',
    subject: `🗓 Nueva cita: ${opts.patientName} — ${dateFormatted}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <h2 style="color:#f06292;margin-top:0">Nueva cita agendada</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px;font-weight:bold;background:#f9f9f9;width:35%">Paciente</td><td style="padding:8px">${opts.patientName}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Fecha</td><td style="padding:8px;text-transform:capitalize">${dateFormatted}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;background:#f9f9f9">Hora</td><td style="padding:8px;background:#f9f9f9">${timeFormatted}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Servicio</td><td style="padding:8px">${serviceLabel}</td></tr>
        </table>
      </div>
    `,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, cedula, phone, email, service, date, time, notes } = body

    if (!name || !date || !time || !service) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Check slot is still available
    const { data: existing } = await supabase
      .from('appointments')
      .select('id')
      .eq('appointment_date', date)
      .eq('appointment_time', time + ':00')
      .not('status', 'in', '("cancelled","no_show")')
      .limit(1)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Este horario ya no está disponible. Por favor elige otro.' }, { status: 409 })
    }

    // Find or create patient (match by cedula first, then email)
    let patientId: string | null = null

    if (cedula) {
      const { data: byCI } = await supabase
        .from('patients')
        .select('id')
        .eq('cedula', cedula)
        .single()
      if (byCI) patientId = byCI.id
    }

    if (!patientId && email) {
      const { data: byEmail } = await supabase
        .from('patients')
        .select('id')
        .eq('email', email)
        .single()
      if (byEmail) patientId = byEmail.id
    }

    if (!patientId) {
      const { data: newPatient, error: patientErr } = await supabase
        .from('patients')
        .insert({ name, cedula: cedula || null, phone: phone || null, email: email || null, total_visits: 0 })
        .select('id')
        .single()
      if (patientErr) return NextResponse.json({ error: patientErr.message }, { status: 500 })
      patientId = newPatient.id
    } else {
      // Update contact info if patient exists
      await supabase
        .from('patients')
        .update({ name, phone: phone || null, email: email || null })
        .eq('id', patientId)
    }

    // Create appointment
    const { data: appt, error: apptErr } = await supabase
      .from('appointments')
      .insert({
        patient_id: patientId,
        appointment_date: date,
        appointment_time: time + ':00',
        service_type: service,
        status: 'scheduled',
        is_first_visit: false,
        notes: notes || null,
      })
      .select()
      .single()

    if (apptErr) return NextResponse.json({ error: apptErr.message }, { status: 500 })

    // Send emails (non-blocking — don't fail the request if email fails)
    sendEmails({ patientName: name, patientEmail: email, date, time, service }).catch(err =>
      console.error('Email error:', err)
    )

    return NextResponse.json({ success: true, appointmentId: appt.id })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
