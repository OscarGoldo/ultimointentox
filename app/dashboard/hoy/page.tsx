import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { format, addDays, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { CheckCircle, Clock, CalendarDays, UserPlus, Baby } from 'lucide-react'
import { Appointment } from '@/lib/types'
import { getGreeting, getTodayString } from '@/lib/utils'
import AppointmentSection from './components/AppointmentSection'
import UpcomingAppointments from './components/UpcomingAppointments'

export const dynamic = 'force-dynamic'

export default async function HoyPage() {
  const supabase = await createClient()
  const today = getTodayString()
  const in30days = format(addDays(new Date(), 30), 'yyyy-MM-dd')

  // Fetch today's appointments with patient data
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, patient:patients(*)')
    .eq('appointment_date', today)
    .order('appointment_time', { ascending: true })

  // Fetch upcoming appointments (tomorrow → +30 days)
  const { data: upcomingRaw } = await supabase
    .from('appointments')
    .select('*, patient:patients(*)')
    .gt('appointment_date', today)
    .lte('appointment_date', in30days)
    .not('status', 'in', '("cancelled","no_show")')
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true })

  // Pregnant patients count
  const { count: pregnantCount } = await supabase
    .from('patients')
    .select('*', { count: 'exact', head: true })
    .eq('is_pregnant', true)

  const appts: Appointment[] = appointments || []
  const total = appts.length

  // Group upcoming by date
  const upcomingByDate: { date: string; label: string; appts: Appointment[] }[] = []
  for (const appt of (upcomingRaw || [])) {
    const last = upcomingByDate[upcomingByDate.length - 1]
    if (last && last.date === appt.appointment_date) {
      last.appts.push(appt)
    } else {
      const d = parseISO(appt.appointment_date)
      const label = format(d, "EEEE d 'de' MMMM", { locale: es })
      upcomingByDate.push({ date: appt.appointment_date, label, appts: [appt] })
    }
  }
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
      <AppointmentSection defaultDate={today} initialAppointments={appts} />

      {/* Upcoming appointments — collapsible */}
      {upcomingByDate.length > 0 && (
        <UpcomingAppointments groups={upcomingByDate} />
      )}

      {/* Pregnant patients alert */}
      {(pregnantCount ?? 0) > 0 && (
        <div className="bg-pink-400/10 border border-pink-400/30 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Baby size={20} className="text-pink-400 flex-shrink-0" />
            <div>
              <p className="text-pink-400 font-semibold text-sm">Pacientes embarazadas</p>
              <p className="text-slate-400 text-xs mt-0.5">
                {pregnantCount} paciente{pregnantCount !== 1 ? 's' : ''} actualmente embarazada{pregnantCount !== 1 ? 's' : ''}.{' '}
                <Link href="/dashboard/pacientes?filter=embarazo" className="text-pink-400 underline">
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
