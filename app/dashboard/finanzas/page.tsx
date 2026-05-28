import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { FileText } from 'lucide-react'
import { formatCurrency, getServiceLabel } from '@/lib/utils'
import { Expense } from '@/lib/types'
import FinanzasCharts, { PeriodData } from './components/FinanzasCharts'
import ExpensesSection from './components/ExpensesSection'

export const dynamic = 'force-dynamic'

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function buildMonthly(
  appts: { appointment_date: string; revenue: number | null }[],
  exps: { date: string; amount: number }[],
  count = 12
): PeriodData[] {
  const out: PeriodData[] = []
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - i)
    const key = monthKey(d)
    const label = format(d, 'MMM yy', { locale: es })
    const revenue = appts.filter(a => a.appointment_date?.slice(0, 7) === key).reduce((s, a) => s + (a.revenue ?? 0), 0)
    const expenses = exps.filter(e => e.date?.slice(0, 7) === key).reduce((s, e) => s + e.amount, 0)
    out.push({ key, label, revenue, expenses })
  }
  return out
}

function buildAnnual(
  appts: { appointment_date: string; revenue: number | null }[],
  exps: { date: string; amount: number }[]
): PeriodData[] {
  const years = new Set<string>()
  appts.forEach(a => { if (a.appointment_date) years.add(a.appointment_date.slice(0, 4)) })
  exps.forEach(e => { if (e.date) years.add(e.date.slice(0, 4)) })
  if (!years.size) return []
  return Array.from(years).sort().map(year => ({
    key: year,
    label: year,
    revenue: appts.filter(a => a.appointment_date?.startsWith(year)).reduce((s, a) => s + (a.revenue ?? 0), 0),
    expenses: exps.filter(e => e.date?.startsWith(year)).reduce((s, e) => s + e.amount, 0),
  }))
}

function buildHistorical(
  appts: { appointment_date: string; revenue: number | null }[],
  exps: { date: string; amount: number }[]
): PeriodData[] {
  const months = new Set<string>()
  appts.forEach(a => { if (a.appointment_date) months.add(a.appointment_date.slice(0, 7)) })
  exps.forEach(e => { if (e.date) months.add(e.date.slice(0, 7)) })
  if (!months.size) return []
  return Array.from(months).sort().map(key => {
    const [y, m] = key.split('-').map(Number)
    const d = new Date(y, m - 1, 1)
    return {
      key,
      label: format(d, 'MMM yy', { locale: es }),
      revenue: appts.filter(a => a.appointment_date?.slice(0, 7) === key).reduce((s, a) => s + (a.revenue ?? 0), 0),
      expenses: exps.filter(e => e.date?.slice(0, 7) === key).reduce((s, e) => s + e.amount, 0),
    }
  })
}

export default async function FinanzasPage() {
  const supabase = await createClient()

  const [{ data: apptData }, { data: expData }] = await Promise.all([
    supabase.from('appointments').select('appointment_date, revenue, service_type').not('revenue', 'is', null),
    supabase.from('expenses').select('*').order('date', { ascending: false }),
  ])

  const appts = apptData ?? []
  const expenses: Expense[] = expData ?? []

  // Current and previous month keys
  const now = new Date()
  const curKey = monthKey(now)
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevKey = monthKey(prevDate)

  // KPIs
  const curRevenue = appts.filter(a => a.appointment_date?.slice(0, 7) === curKey).reduce((s, a) => s + (a.revenue ?? 0), 0)
  const curExpenses = expenses.filter(e => e.date?.slice(0, 7) === curKey).reduce((s, e) => s + e.amount, 0)
  const curProfit = curRevenue - curExpenses
  const totalRevenue = appts.reduce((s, a) => s + (a.revenue ?? 0), 0)
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)

  // Previous month report
  const prevAppts = appts.filter(a => a.appointment_date?.slice(0, 7) === prevKey)
  const prevRevenue = prevAppts.reduce((s, a) => s + (a.revenue ?? 0), 0)
  const prevExpenses = expenses.filter(e => e.date?.slice(0, 7) === prevKey).reduce((s, e) => s + e.amount, 0)
  const prevProfit = prevRevenue - prevExpenses
  const prevMargin = prevRevenue > 0 ? Math.round((prevProfit / prevRevenue) * 100) : 0
  const prevMonthLabel = format(prevDate, "MMMM 'de' yyyy", { locale: es })

  // Service breakdown for previous month
  const svcBreakdown: Record<string, number> = {}
  prevAppts.forEach(a => {
    if (a.service_type && a.revenue) svcBreakdown[a.service_type] = (svcBreakdown[a.service_type] ?? 0) + a.revenue
  })
  const topServices = Object.entries(svcBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 4)

  // Chart data
  const monthly = buildMonthly(appts, expenses, 12)
  const annual = buildAnnual(appts, expenses)
  const historical = buildHistorical(appts, expenses)

  const kpis = [
    { label: 'Ingresos este mes', value: curRevenue, color: 'text-[#f06292]' },
    { label: 'Gastos este mes', value: curExpenses, color: 'text-red-400' },
    { label: 'Ganancia neta', value: curProfit, color: curProfit >= 0 ? 'text-emerald-400' : 'text-red-400' },
    { label: 'Ingresos históricos', value: totalRevenue, color: 'text-white' },
  ]

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-slate-400 text-sm">Control económico</p>
        <h1 className="text-white text-2xl font-bold mt-0.5">Finanzas</h1>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {kpis.map(k => (
          <div key={k.label} className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
            <p className="text-slate-400 text-xs mb-2">{k.label}</p>
            <p className={`text-2xl font-bold ${k.color}`}>{formatCurrency(k.value)}</p>
          </div>
        ))}
      </div>

      {/* Rentabilidad rápida */}
      {(totalRevenue > 0 || totalExpenses > 0) && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-4">
          <h2 className="text-white font-semibold text-sm mb-3">Rentabilidad acumulada</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Ingresos totales</span>
                <span className="text-[#f06292]">{formatCurrency(totalRevenue)}</span>
              </div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Gastos totales</span>
                <span className="text-red-400">{formatCurrency(totalExpenses)}</span>
              </div>
              <div className="border-t border-slate-700 pt-2 mt-2 flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Ganancia neta</span>
                <span className={`font-bold ${totalRevenue - totalExpenses >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatCurrency(totalRevenue - totalExpenses)}
                </span>
              </div>
            </div>
            {totalRevenue > 0 && (
              <div className="text-center flex-shrink-0">
                <p className="text-slate-400 text-xs mb-1">Margen</p>
                <p className={`text-3xl font-bold ${((totalRevenue - totalExpenses) / totalRevenue) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {Math.round(((totalRevenue - totalExpenses) / totalRevenue) * 100)}%
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Charts */}
      <FinanzasCharts monthly={monthly} annual={annual} historical={historical} />

      {/* Monthly Report */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={15} className="text-[#f06292]" />
          <h2 className="text-white font-semibold text-sm">Informe mensual</h2>
          <span className="text-slate-500 text-xs capitalize ml-auto">{prevMonthLabel}</span>
        </div>

        {prevRevenue === 0 && prevExpenses === 0 ? (
          <p className="text-slate-600 text-sm text-center py-4 capitalize">Sin movimientos en {prevMonthLabel}</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { label: 'Ingresos', value: prevRevenue, color: 'text-[#f06292]' },
                { label: 'Gastos', value: prevExpenses, color: 'text-red-400' },
                { label: 'Ganancia', value: prevProfit, color: prevProfit >= 0 ? 'text-emerald-400' : 'text-red-400' },
                { label: 'Margen', raw: `${prevMargin}%`, color: prevMargin >= 0 ? 'text-emerald-400' : 'text-red-400' },
              ].map(item => (
                <div key={item.label} className="bg-slate-900 rounded-xl p-3">
                  <p className="text-slate-500 text-xs mb-1">{item.label}</p>
                  <p className={`font-bold text-sm ${item.color}`}>
                    {'raw' in item ? item.raw : formatCurrency(item.value as number)}
                  </p>
                </div>
              ))}
            </div>

            {topServices.length > 0 && (
              <div className="border-t border-slate-700/50 pt-3">
                <p className="text-slate-500 text-xs uppercase tracking-wide mb-2">Servicios del mes</p>
                <div className="space-y-2">
                  {topServices.map(([svc, amount]) => (
                    <div key={svc} className="flex items-center justify-between">
                      <span className="text-slate-300 text-sm">{getServiceLabel(svc)}</span>
                      <span className="text-[#f06292] text-sm font-medium">{formatCurrency(amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Expenses CRUD */}
      <ExpensesSection initialExpenses={expenses} />
    </div>
  )
}
