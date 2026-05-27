import { createClient } from '@/lib/supabase/server'
import { format, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatCurrency, getMonthRange, SERVICE_LABELS } from '@/lib/utils'
import MonthlyCharts from './MonthlyCharts'

export const dynamic = 'force-dynamic'

interface SearchParams {
  year?: string
  month?: string
}

export default async function MesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const now = new Date()
  const year = params.year ? parseInt(params.year) : now.getFullYear()
  const month = params.month ? parseInt(params.month) : now.getMonth()

  const { start, end } = getMonthRange(year, month)

  // Previous month
  const prevDate = subMonths(new Date(year, month, 1), 1)
  const prevYear = prevDate.getFullYear()
  const prevMonth = prevDate.getMonth()
  const { start: prevStart, end: prevEnd } = getMonthRange(prevYear, prevMonth)

  const supabase = await createClient()

  // Current month appointments
  const { data: currentAppts } = await supabase
    .from('appointments')
    .select('*, patient:patients(id, name, is_first_visit:appointments(count))')
    .gte('appointment_date', start)
    .lte('appointment_date', end)

  // Previous month appointments
  const { data: prevAppts } = await supabase
    .from('appointments')
    .select('id, status, revenue, service_type, is_first_visit')
    .gte('appointment_date', prevStart)
    .lte('appointment_date', prevEnd)

  const curr = currentAppts || []
  const prev = prevAppts || []

  // Metrics
  const totalCurr = curr.length
  const totalPrev = prev.length
  const completedCurr = curr.filter((a) => a.status === 'completed').length
  const completedPrev = prev.filter((a) => a.status === 'completed').length
  const revenueCurr = curr.reduce((s, a) => s + (a.revenue || 0), 0)
  const revenuePrev = prev.reduce((s, a) => s + (a.revenue || 0), 0)
  const newPatientsCurr = curr.filter((a) => a.is_first_visit).length
  const newPatientsPrev = prev.filter((a) => a.is_first_visit).length

  // Service breakdown
  const serviceMap: Record<string, number> = {}
  for (const a of curr) {
    if (a.service_type) {
      serviceMap[a.service_type] = (serviceMap[a.service_type] || 0) + 1
    }
  }
  const serviceBreakdown = Object.entries(serviceMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  // Weekly data for chart (4 weeks)
  const weeklyData = [1, 2, 3, 4].map((week) => {
    const weekStart = new Date(year, month, (week - 1) * 7 + 1)
    const weekEnd = new Date(year, month, week * 7)
    const count = curr.filter((a) => {
      const d = new Date(a.appointment_date)
      return d >= weekStart && d <= weekEnd
    }).length
    return { name: `Sem ${week}`, citas: count }
  })

  const monthLabel = format(new Date(year, month, 1), 'MMMM yyyy', { locale: es })
  const prevMonthLabel = format(new Date(prevYear, prevMonth, 1), 'MMMM yyyy', { locale: es })

  // Navigation URLs
  const prevNavDate = subMonths(new Date(year, month, 1), 1)
  const nextNavDate = new Date(year, month + 1, 1)
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()

  const prevUrl = `/dashboard/mes?year=${prevNavDate.getFullYear()}&month=${prevNavDate.getMonth()}`
  const nextUrl = `/dashboard/mes?year=${nextNavDate.getFullYear()}&month=${nextNavDate.getMonth()}`

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header with month selector */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-slate-400 text-sm">Resumen mensual</p>
          <h1 className="text-white text-2xl font-bold mt-0.5 capitalize">{monthLabel}</h1>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={prevUrl}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors text-sm"
          >
            ‹
          </a>
          {!isCurrentMonth && (
            <a
              href={`/dashboard/mes?year=${now.getFullYear()}&month=${now.getMonth()}`}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors text-xs"
            >
              Hoy
            </a>
          )}
          <a
            href={nextUrl}
            className={`p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors text-sm ${isCurrentMonth ? 'opacity-40 pointer-events-none' : ''}`}
          >
            ›
          </a>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Total citas"
          current={totalCurr}
          previous={totalPrev}
          format="number"
        />
        <StatCard
          label="Completadas"
          current={completedCurr}
          previous={completedPrev}
          format="number"
          color="text-emerald-400"
        />
        <StatCard
          label="Ingresos"
          current={revenueCurr}
          previous={revenuePrev}
          format="currency"
          color="text-[#f06292]"
        />
        <StatCard
          label="Nuevas pacientes"
          current={newPatientsCurr}
          previous={newPatientsPrev}
          format="number"
        />
      </div>

      {/* Charts (client component) */}
      <MonthlyCharts weeklyData={weeklyData} />

      {/* Service breakdown */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-6">
        <h2 className="text-white font-semibold text-sm mb-4">Distribución por servicio</h2>
        {serviceBreakdown.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">Sin datos para este mes</p>
        ) : (
          <div className="space-y-3">
            {serviceBreakdown.map(([service, count]) => {
              const pct = totalCurr > 0 ? Math.round((count / totalCurr) * 100) : 0
              return (
                <div key={service}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-slate-300 text-sm">
                      {SERVICE_LABELS[service] || service}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-xs">{count} citas</span>
                      <span className="text-white text-xs font-medium w-8 text-right">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#f06292] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Vs previous month note */}
      <p className="text-center text-slate-600 text-xs">
        Comparado con {prevMonthLabel}
      </p>
    </div>
  )
}

function StatCard({
  label,
  current,
  previous,
  format: fmt,
  color = 'text-white',
}: {
  label: string
  current: number
  previous: number
  format: 'number' | 'currency'
  color?: string
}) {
  const diff = previous === 0 ? 0 : Math.round(((current - previous) / previous) * 100)
  const isUp = diff > 0
  const isDown = diff < 0

  const displayValue = fmt === 'currency' ? formatCurrency(current) : current.toString()

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
      <p className="text-slate-400 text-xs mb-2">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{displayValue}</p>
      <div className="flex items-center gap-1 mt-1">
        {isUp && <TrendingUp size={12} className="text-emerald-400" />}
        {isDown && <TrendingDown size={12} className="text-red-400" />}
        {!isUp && !isDown && <Minus size={12} className="text-slate-500" />}
        <span
          className={`text-xs ${isUp ? 'text-emerald-400' : isDown ? 'text-red-400' : 'text-slate-500'}`}
        >
          {diff > 0 ? '+' : ''}{diff}% vs mes ant.
        </span>
      </div>
    </div>
  )
}
