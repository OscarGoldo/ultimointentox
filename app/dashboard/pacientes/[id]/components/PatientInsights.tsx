'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function PatientInsights({ patientId }: { patientId: string }) {
  const [loading, setLoading] = useState(false)
  const [insights, setInsights] = useState<string[]>([])
  const [generated, setGenerated] = useState(false)

  async function generate() {
    setLoading(true)
    try {
      const res = await fetch(`/api/patients/${patientId}/insights`, { method: 'POST' })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setInsights(data.insights || [])
      setGenerated(true)
    } catch {
      toast.error('No se pudo generar el resumen. Agrega tu ANTHROPIC_API_KEY en Vercel.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-[#f06292]" />
          <h2 className="text-white font-semibold text-sm">Resumen IA</h2>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f06292]/20 border border-[#f06292]/40 text-[#f06292] text-xs font-medium hover:bg-[#f06292]/30 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
          {generated ? 'Regenerar' : 'Generar resumen'}
        </button>
      </div>

      {!generated && !loading && (
        <p className="text-slate-500 text-sm">Resumen clínico de la paciente basado en su historial completo.</p>
      )}
      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-4 bg-slate-700 rounded animate-pulse" />)}
        </div>
      )}
      {generated && insights.map((insight, i) => (
        <div key={i} className="flex gap-3 mb-3 last:mb-0">
          <div className="w-5 h-5 rounded-full bg-[#f06292]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-[#f06292] text-xs font-bold">{i + 1}</span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{insight}</p>
        </div>
      ))}
    </div>
  )
}
