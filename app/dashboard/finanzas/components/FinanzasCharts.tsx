'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'

export interface PeriodData {
  key: string
  label: string
  revenue: number
  expenses: number
}

interface Props {
  monthly: PeriodData[]
  annual: PeriodData[]
  historical: PeriodData[]
}

const TABS = [
  { key: 'monthly' as const, label: '12 meses' },
  { key: 'annual' as const, label: 'Anual' },
  { key: 'historical' as const, label: 'Histórico' },
]

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { dataKey: string; value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  const revenue = payload.find(p => p.dataKey === 'revenue')?.value ?? 0
  const expenses = payload.find(p => p.dataKey === 'expenses')?.value ?? 0
  const profit = revenue - expenses
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl text-xs">
      <p className="text-white font-semibold mb-2">{label}</p>
      <div className="space-y-1.5">
        <div className="flex justify-between gap-6">
          <span className="text-slate-400">Ingresos</span>
          <span className="text-[#f06292] font-medium">{formatCurrency(revenue)}</span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-slate-400">Gastos</span>
          <span className="text-red-400 font-medium">{formatCurrency(expenses)}</span>
        </div>
        <div className="flex justify-between gap-6 border-t border-slate-700 pt-1.5">
          <span className="text-slate-400">Ganancia</span>
          <span className={`font-bold ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatCurrency(profit)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function FinanzasCharts({ monthly, annual, historical }: Props) {
  const [tab, setTab] = useState<'monthly' | 'annual' | 'historical'>('monthly')
  const data = tab === 'monthly' ? monthly : tab === 'annual' ? annual : historical

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-sm">Ingresos vs Gastos</h2>
        <div className="flex gap-1">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
                tab === t.key
                  ? 'bg-[#f06292]/20 text-[#f06292] border-[#f06292]/40'
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center">
          <p className="text-slate-600 text-sm">Sin datos para este período</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barGap={3}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="revenue" fill="#f06292" radius={[3, 3, 0, 0]} maxBarSize={26} />
            <Bar dataKey="expenses" fill="#ef4444" radius={[3, 3, 0, 0]} maxBarSize={26} />
          </BarChart>
        </ResponsiveContainer>
      )}

      <div className="flex gap-5 mt-3 justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#f06292]" />
          <span className="text-slate-500 text-xs">Ingresos</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-red-500" />
          <span className="text-slate-500 text-xs">Gastos</span>
        </div>
      </div>
    </div>
  )
}
