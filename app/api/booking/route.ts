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
      html: `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;" bgcolor="#f1f5f9">
<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f1f5f9"><tr><td align="center" style="padding:32px 16px;">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

  <!-- HEADER -->
  <tr><td align="center" bgcolor="#f06292" style="padding:44px 32px 36px;">
    <table cellpadding="0" cellspacing="0"><tr>
      <td width="70" height="70" align="center" bgcolor="#c2185b" style="border-radius:50%;font-size:34px;color:#ffffff;font-weight:bold;">&#10003;</td>
    </tr></table>
    <br>
    <span style="font-family:Arial,sans-serif;font-size:26px;font-weight:700;color:#ffffff;">¡Cita Confirmada!</span>
    <br><br>
    <span style="font-family:Arial,sans-serif;font-size:14px;color:#fce7f3;">Su reservación ha sido recibida con éxito</span>
  </td></tr>

  <!-- BODY -->
  <tr><td bgcolor="#ffffff" style="padding:36px 32px;">
    <p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:16px;color:#111827;">Estimada <strong>${opts.patientName}</strong>,</p>
    <p style="margin:0 0 28px 0;font-family:Arial,sans-serif;font-size:14px;color:#6b7280;line-height:1.7;">Su cita ha sido confirmada con la <strong style="color:#111827;">Dra. Hilda Mary Díaz García</strong>, Médico Especialista en Ginecología y Obstetricia.</p>

    <!-- Tabla detalles -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr><td colspan="2" bgcolor="#fdf2f8" style="padding:12px 20px;border-left:4px solid #f06292;">
        <span style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#be185d;letter-spacing:1px;">DETALLES DE SU CITA</span>
      </td></tr>
      <tr>
        <td bgcolor="#ffffff" style="padding:13px 20px;font-family:Arial,sans-serif;font-size:13px;color:#9ca3af;width:38%;border-bottom:1px solid #f3f4f6;">📅 Fecha</td>
        <td bgcolor="#ffffff" style="padding:13px 20px;font-family:Arial,sans-serif;font-size:14px;color:#111827;font-weight:700;text-transform:capitalize;border-bottom:1px solid #f3f4f6;">${dateFormatted}</td>
      </tr>
      <tr>
        <td bgcolor="#fdf2f8" style="padding:13px 20px;font-family:Arial,sans-serif;font-size:13px;color:#9ca3af;border-bottom:1px solid #f3f4f6;">🕐 Hora</td>
        <td bgcolor="#fdf2f8" style="padding:13px 20px;font-family:Arial,sans-serif;font-size:14px;color:#111827;font-weight:700;border-bottom:1px solid #f3f4f6;">${timeFormatted}</td>
      </tr>
      <tr>
        <td bgcolor="#ffffff" style="padding:13px 20px;font-family:Arial,sans-serif;font-size:13px;color:#9ca3af;border-bottom:1px solid #f3f4f6;">🩺 Servicio</td>
        <td bgcolor="#ffffff" style="padding:13px 20px;font-family:Arial,sans-serif;font-size:14px;color:#111827;font-weight:700;border-bottom:1px solid #f3f4f6;">${serviceLabel}</td>
      </tr>
      <tr>
        <td bgcolor="#fdf2f8" style="padding:13px 20px;font-family:Arial,sans-serif;font-size:13px;color:#9ca3af;">📍 Lugar</td>
        <td bgcolor="#fdf2f8" style="padding:13px 20px;font-family:Arial,sans-serif;font-size:14px;color:#111827;">Clínica Tierra Santa, Piso 3, Cons. 3<br><span style="color:#9ca3af;font-size:13px;">Maturín, Estado Monagas</span></td>
      </tr>
    </table>

    <!-- Aviso -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td width="5" bgcolor="#f59e0b">&nbsp;</td>
        <td bgcolor="#fffbeb" style="padding:14px 18px;">
          <span style="font-family:Arial,sans-serif;font-size:13px;color:#92400e;line-height:1.6;">&#9888;&#65039; Para cancelar o reprogramar, comuníquese con al menos <strong>24 horas de anticipación</strong>.</span>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#6b7280;">
      📞 <a href="tel:+584120896444" style="color:#f06292;text-decoration:none;font-weight:600;">0412-089-6444</a>
      &nbsp;·&nbsp; Lunes a Viernes, 8:00 AM – 5:00 PM
    </p>
  </td></tr>

  <!-- FOOTER -->
  <tr><td align="center" bgcolor="#f8fafc" style="padding:20px 32px;border-top:2px solid #fce7f3;">
    <span style="font-family:Arial,sans-serif;font-size:12px;color:#9ca3af;">Consultorio Dra. Hilda Mary Díaz García &nbsp;·&nbsp; Maturín, Venezuela</span>
  </td></tr>

</table>
</td></tr></table>
</body></html>`,
    })
  }

  // Notification to doctor + monitoring
  await transporter.sendMail({
    from: `"Sistema de citas" <${smtpUser}>`,
    to: 'hildadiaz.69@gmail.com, oscarvalery10@gmail.com',
    subject: `🗓 Nueva cita: ${opts.patientName} — ${dateFormatted}`,
    html: `
<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:520px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
    <div style="background:#1e293b;padding:24px 28px;border-bottom:3px solid #f06292">
      <p style="margin:0;color:#f06292;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">OzMed · Panel de citas</p>
      <h2 style="margin:6px 0 0;color:#ffffff;font-size:20px">🗓 Nueva cita agendada</h2>
    </div>
    <div style="padding:24px 28px">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;width:35%">Paciente</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-weight:600">${opts.patientName}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280">Fecha</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-weight:600;text-transform:capitalize">${dateFormatted}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280">Hora</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#111827;font-weight:600">${timeFormatted}</td></tr>
        <tr><td style="padding:10px 0;color:#6b7280">Servicio</td><td style="padding:10px 0;color:#111827;font-weight:600">${serviceLabel}</td></tr>
      </table>
    </div>
    <div style="background:#f9fafb;padding:16px 28px;text-align:center">
      <p style="margin:0;color:#9ca3af;font-size:12px">Notificación automática del sistema de reservas</p>
    </div>
  </div>
</body>
</html>
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

    // Send emails — await so we can report status
    let emailSent = false
    try {
      await sendEmails({ patientName: name, patientEmail: email, date, time, service })
      emailSent = true
    } catch (emailErr) {
      console.error('Email error:', emailErr)
    }

    return NextResponse.json({ success: true, appointmentId: appt.id, emailSent })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
