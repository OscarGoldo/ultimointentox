import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import {
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  TrendingUp,
  ArrowLeft,
  Clock,
} from 'lucide-react'
import {
  formatDate,
  formatDateShort,
  formatTime,
  formatCurrency,
  getStatusColor,
  getStatusLabel,
  getServiceLabel,
  buildWhatsAppUrl,
  getInitials,
} from '@/lib/utils'
import { Appointment } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: patient } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single()

  if (!patient) notFound()

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', id)
    .order('appointment_date', { ascending: false })

  const appts: Appointment[] = appointments || []
  const totalRevenue = appts.reduce((s, a) => s + (a.revenue || 0), 0)

  const phone = patient.phone || ''
  const waMessage = `Hola ${patient.name.split(' ')[0]}, le escribimos del consultorio de la Dra. Hilda Díaz García. ¿Le gustaría agendar su próxima consulta?`
  const waUrl = phone ? buildWhatsAppUrl(phone, waMessage) : null

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      {/* Back */}
      <Link
        href="/dashboard/pacientes"
        className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-5 transition-colors"
      >
        <ArrowLeft size={15} />
        Pacientes
      </Link>

      {/* Patient header */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-[#f06292]/20 border border-[#f06292]/30 flex items-center justify-center flex-shrink-0">
            <span className="text-[#f06292] text-xl font-bold">{getInitials(patient.name)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-white text-xl font-bold">{patient.name}</h1>
            <div className="mt-2 space-y-1.5">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
                >
                  <Phone size={14} />
                  {phone}
                </a>
              )}
              {patient.email && (
                <a
                  href={`mailto:${patient.email}`}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
                >
                  <Mail size={14} />
                  {patient.email}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Contact buttons */}
        <div className="flex gap-2 mt-4">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors text-sm font-medium"
            >
              <Phone size={15} />
              Llamar
            </a>
          )}
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-colors text-sm font-medium"
            >
              <MessageCircle size={15} />
              WhatsApp
            </a>
          )}
        </div>

        {patient.notes && (
          <div className="mt-4 bg-slate-900 rounded-xl p-3">
            <p className="text-slate-400 text-xs mb-1">Notas</p>
            <p className="text-white text-sm">{patient.notes}</p>
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={15} className="text-slate-400" />
            <p className="text-slate-400 text-xs">Total visitas</p>
          </div>
          <p className="text-white text-2xl font-bold">{patient.total_visits}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={15} className="text-[#f06292]" />
            <p className="text-slate-400 text-xs">Ingresos totales</p>
          </div>
          <p className="text-[#f06292] text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
          <p className="text-slate-400 text-xs mb-1">Primera visita</p>
          <p className="text-white text-sm font-medium">
            {patient.first_visit_date ? formatDateShort(patient.first_visit_date) : '—'}
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
          <p className="text-slate-400 text-xs mb-1">Última visita</p>
          <p className="text-white text-sm font-medium">
            {patient.last_visit_date ? formatDateShort(patient.last_visit_date) : '—'}
          </p>
        </div>
      </div>

      {/* Appointment timeline */}
      <h2 className="text-white font-semibold text-sm mb-3">Historial de citas</h2>
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        {appts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Clock size={32} className="text-slate-600 mb-3" />
            <p className="text-slate-400 text-sm">Sin citas registradas</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {appts.map((appt) => (
              <div key={appt.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-white text-sm font-medium">
                      {formatDate(appt.appointment_date)}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {formatTime(appt.appointment_time)} · {getServiceLabel(appt.service_type)}
                    </p>
                    {appt.revenue != null && (
                      <p className="text-[#f06292] text-xs mt-1">{formatCurrency(appt.revenue)}</p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium border flex-shrink-0 ${getStatusColor(appt.status)}`}
                  >
                    {getStatusLabel(appt.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
