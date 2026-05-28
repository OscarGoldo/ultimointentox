'use client'

import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  patientId: string
  initialIsPregnant: boolean
  initialStartDate?: string
}

export default function PregnancyToggle({ patientId, initialIsPregnant, initialStartDate }: Props) {
  const [isPregnant, setIsPregnant] = useState(initialIsPregnant)
  const [startDate, setStartDate] = useState(initialStartDate || '')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  async function update(pregnant: boolean, date?: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/patients/${patientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_pregnant: pregnant, pregnancy_start_date: date || null }),
      })
      if (!res.ok) throw new Error()
      setIsPregnant(pregnant)
      if (date) setStartDate(date)
      toast.success(pregnant ? 'Marcada como embarazada' : 'Embarazo removido')
    } catch {
      toast.error('No se pudo actualizar')
    } finally {
      setLoading(false)
      setShowForm(false)
    }
  }

  if (isPregnant) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-400/20 border border-pink-400/40 text-pink-400 text-xs font-medium">
          🤰 Embarazada
          {startDate && <span className="text-pink-300/70 ml-1">· {startDate}</span>}
        </span>
        <button
          onClick={() => update(false)}
          disabled={loading}
          className="text-slate-500 hover:text-red-400 text-xs transition-colors"
        >
          Quitar
        </button>
      </div>
    )
  }

  if (showForm) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <div>
          <p className="text-slate-500 text-xs mb-1">Fecha inicio embarazo</p>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#f06292]"
          />
        </div>
        <button
          onClick={() => update(true, startDate || undefined)}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-pink-500 text-white text-xs font-medium hover:bg-pink-600 transition-colors disabled:opacity-50"
        >
          {loading ? '...' : 'Guardar'}
        </button>
        <button onClick={() => setShowForm(false)} className="text-slate-500 text-xs hover:text-slate-300">
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700 text-slate-400 hover:text-pink-400 hover:border-pink-400/40 transition-colors text-xs"
    >
      🤰 Marcar embarazo
    </button>
  )
}
