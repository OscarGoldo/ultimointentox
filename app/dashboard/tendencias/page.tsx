import { createClient } from '@/lib/supabase/server'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { es } from 'date-fns/locale'
import { Users, DollarSign, Calendar } from 'lucide-react'
import { formatCurrency, SERVICE_LABELS } from '@/lib/utils'
import TendenciasCharts from './TendenciasCharts'
import InsightsSection from './InsightsSection'

export const dynamic = 'force-dynamic'

export default async function TendenciasPage() {
  const supabase = await createClient()
  const now = new Date()

  // Build last 12 months data
  const monthlyData: {
    month: string
    label: string
    citas: number
    ingresos: number
    nuevas: number
  }[] = []

  for (let i = 11; i >= 0; i--) {
    const d = subMonths(now, i)
    const start = format(startOfMonth(d), 'yyyy-MM-dd')
    const end = format(endOfMonth(d), 'yyyy-MM-dd')
    const label = format(d, 'MMM yy', { locale: es })

    const { data: appts } = await supabase
      .from('appointments')
      .select('status, revenue, is_first_visit')
      .gte('appointment_date', start)
      .lte('appointment_date', end)

    const list = appts || []
    const citas = list.length
    const ingresos = list.reduce((s, a) => s + (a.revenue || 0), 0)
    const nuevas = list.filter((a) => a.is_first_visit).length

    monthlyData.push({ month: start, label, citas, ingresos, nuevas })
  }

  // Annual KPIs
  const yearStart = format(new Date(now.getFullYear(), 0, 1), 'yyyy-MM-dd')
  const { data: yearAppts } = await supabase
    .from('appointments')
    .select('status, revenue, is_first_visit, service_type')
    .gte('appointment_date', yearStart)

  const yearList = yearAppts || []
  const yearTotal = yearList.length
  const yearRevenue = yearList.reduce((s, a) => s + (a.revenue || 0), 0)
  const yearNewPatients = yearList.filter((a) => a.is_first_visit).length
  const yearCompleted = yearList.filter((a) => a.status === 'completed').length
  const yearNoShow = yearList.filter((a) => a.status === 'no_show').length
  const attendanceRate = yearTotal > 0 ? Math.round((yearCompleted / yearTotal) * 100) : 0

  // Service breakdown this year
  const serviceMap: Record<string, number> = {}
  for (const a of yearList) {
    if (a.service_type) {
      serviceMap[a.service_type] = (serviceMap[a.service_type] || 0) + 1
    }
  }
  const serviceBreakdown = Object.entries(serviceMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  const statsForInsights = {
    totalAppointments: yearTotal,
    revenue: yearRevenue,
    newPatients: yearNewPatients,
    attendanceRate,
    topService: serviceBreakdown[0]?.[0] || '',
    monthlyData: monthlyData.map((m) => ({ label: m.label, citas: m.citas })),
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-slate-400 text-sm">Análisis anual</p>
        <h1 className="text-white text-2xl font-bold mt-0.5">Tendencias</h1>
        <p className="text-slate-500 text-sm mt-1">Año {now.getFullYear()}</p>
      </div>

      {/* Annual KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <KpiCard
          label="Citas este año"
          value={yearTotal.toString()}
          icon={<Calendar size={20} className="text-[#f06292]" />}
          sub={`${yearCompleted} completadas · ${yearNoShow} no presentadas`}
        />
        <KpiCard
          label="Ingresos del año"
          value={formatCurrency(yearRevenue)}
          icon={<DollarSign size={20} className="text-emerald-400" />}
          sub={`Promedio: ${formatCurrency(yearTotal > 0 ? yearRevenue / yearTotal : 0)}/cita`}
        />
        <KpiCard
          label="Nuevas pacientes"
          value={yearNewPatients.toString()}
          icon={<Users size={20} className="text-blue-400" />}
          sub={`Tasa asistencia: ${attendanceRate}%`}
        />
      </div>

      {/* Line chart (client component) */}
      <TendenciasCharts monthlyData={monthlyData} />

      {/* Service breakdown */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-6">
        <h2 className="text-white font-semibold text-sm mb-4">Servicios del año</h2>
        {serviceBreakdown.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">Sin datos</p>
        ) : (
          <div className="space-y-3">
            {serviceBreakdown.map(([service, count]) => {
              const pct = yearTotal > 0 ? Math.round((count / yearTotal) * 100) : 0
              return (
                <div key={service}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-slate-300 text-sm">{SERVICE_LABELS[service] || service}</p>
                    <div className="flex items-center gap-3">
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

      {/* AI Insights */}
      <InsightsSection stats={statsForInsights} />
    </div>
  )
}

function KpiCard({
  label,
  value,
  icon,
  sub,
}: {
  label: string
  value: string
  icon: React.ReactNode
  sub: string
}) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-slate-400 text-xs">{label}</p>
        {icon}
      </div>
      <p className="text-white text-2xl font-bold mb-1">{value}</p>
      <p className="text-slate-500 text-xs">{sub}</p>
    </div>
  )
}
