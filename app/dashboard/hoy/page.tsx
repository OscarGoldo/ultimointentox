import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarDays, CheckCircle, Clock, UserPlus, AlertTriangle } from 'lucide-react'
import { Appointment } from '@/lib/types'
import { getGreeting, getTodayString } from '@/lib/utils'
import AppointmentRow from './components/AppointmentRow'

export const dynamic = 'force-dynamic'

export default async function HoyPage() {
  const supabase = await createClient()
  const today = getTodayString()

  // Fetch today's appointments with patient data
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, patient:patients(*)')
    .eq('appointment_date', today)
    .order('appointment_time', { ascending: true })

  // At-risk patients count
  const { count: atRiskCount } = await supabase
    .from('at_risk_patients')
    .select('*', { count: 'exact', head: true })

  const appts: Appointment[] = appointments || []
  const total = appts.length
  const confirmed = appts.filter((a) => a.status === 'confirmed').length
  const pending = appts.filter((a) => a.status === 'scheduled').length
  const newPatients = appts.filter((a) => a.is_first_visit).length

  const todayDate = new Date()
  const dayLabel = format(todayDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
  const greeting = getGreeting()

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-slate-400 text-sm">{greeting}, Dra. Hilda</p>
        <h1 className="text-white text-2xl font-bold mt-0.5">Vista del Día</h1>
        <p className="text-slate-500 text-sm capitalize mt-1">{dayLabel}</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <MetricCard
          label="Citas hoy"
          value={total}
          icon={<CalendarDays size={20} className="text-[#f06292]" />}
          color="text-white"
        />
        <MetricCard
          label="Confirmadas"
          value={confirmed}
          icon={<CheckCircle size={20} className="text-emerald-400" />}
          color="text-emerald-400"
        />
        <MetricCard
          label="Pendientes"
          value={pending}
          icon={<Clock size={20} className="text-amber-400" />}
          color="text-amber-400"
        />
        <MetricCard
          label="Nuevas hoy"
          value={newPatients}
          icon={<UserPlus size={20} className="text-[#f06292]" />}
          color="text-[#f06292]"
        />
      </div>

      {/* Appointment List */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-white font-semibold text-sm">Agenda de hoy</h2>
          <span className="text-slate-400 text-xs">{total} citas</span>
        </div>

        {appts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <CalendarDays size={40} className="text-slate-600 mb-3" />
            <p className="text-slate-400 font-medium">Sin citas para hoy</p>
            <p className="text-slate-600 text-sm mt-1">El día está libre</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {appts.map((appt) => (
              <AppointmentRow key={appt.id} appointment={appt} />
            ))}
          </div>
        )}
      </div>

      {/* Pending Actions */}
      {(atRiskCount ?? 0) > 0 && (
        <div className="bg-orange-400/10 border border-orange-400/30 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-orange-400 flex-shrink-0" />
            <div>
              <p className="text-orange-400 font-semibold text-sm">Pacientes en riesgo</p>
              <p className="text-slate-400 text-xs mt-0.5">
                {atRiskCount} paciente{atRiskCount !== 1 ? 's' : ''} sin visita en más de 6 meses.{' '}
                <Link href="/dashboard/pacientes?filter=en-riesgo" className="text-orange-400 underline">
                  Ver lista
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: number
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-slate-400 text-xs">{label}</p>
        {icon}
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  )
}
