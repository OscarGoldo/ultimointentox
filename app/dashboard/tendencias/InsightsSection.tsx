'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  stats: {
    totalAppointments: number
    revenue: number
    newPatients: number
    attendanceRate: number
    topService: string
    monthlyData: { label: string; citas: number }[]
  }
}

export default function InsightsSection({ stats }: Props) {
  const [loading, setLoading] = useState(false)
  const [insights, setInsights] = useState<string[]>([])
  const [generated, setGenerated] = useState(false)

  async function generateInsights() {
    setLoading(true)
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats),
      })
      if (!res.ok) throw new Error('Error')
      const data = await res.json()
      setInsights(data.insights || [])
      setGenerated(true)
    } catch {
      toast.error('No se pudieron generar los insights')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#f06292]" />
          <h2 className="text-white font-semibold text-sm">Insights de IA</h2>
        </div>
        {!generated && (
          <button
            onClick={generateInsights}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-[#f06292]/20 border border-[#f06292]/40 text-[#f06292] text-xs font-medium hover:bg-[#f06292]/30 transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                Generando...
              </>
            ) : (
              'Generar insights'
            )}
          </button>
        )}
      </div>

      {!generated && !loading && (
        <p className="text-slate-500 text-sm">
          Genera recomendaciones basadas en los datos de tu consultorio usando IA.
        </p>
      )}

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-slate-700 rounded animate-pulse" />
          ))}
        </div>
      )}

      {generated && insights.length > 0 && (
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-[#f06292]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#f06292] text-xs font-bold">{i + 1}</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{insight}</p>
            </div>
          ))}
          <button
            onClick={generateInsights}
            className="text-[#f06292] text-xs hover:underline mt-2"
          >
            Regenerar
          </button>
        </div>
      )}
    </div>
  )
}
