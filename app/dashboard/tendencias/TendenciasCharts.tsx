'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface MonthData {
  month: string
  label: string
  citas: number
  ingresos: number
  nuevas: number
}

export default function TendenciasCharts({ monthlyData }: { monthlyData: MonthData[] }) {
  const chartData = monthlyData.map((m) => ({
    name: m.label,
    Citas: m.citas,
    Nuevas: m.nuevas,
  }))

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-6">
      <h2 className="text-white font-semibold text-sm mb-4">Citas últimos 12 meses</h2>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', color: '#94a3b8', paddingTop: '8px' }}
            />
            <Line
              type="monotone"
              dataKey="Citas"
              stroke="#f06292"
              strokeWidth={2}
              dot={{ fill: '#f06292', r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="Nuevas"
              stroke="#34d399"
              strokeWidth={2}
              dot={{ fill: '#34d399', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
