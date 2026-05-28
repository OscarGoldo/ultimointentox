'use client'

import { useState } from 'react'
import { addDays, format, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { formatDateShort } from '@/lib/utils'

function gestationalAge(fumStr: string) {
  const fum = new Date(fumStr + 'T00:00:00')
  const totalDays = Math.max(0, differenceInDays(new Date(), fum))
  return { weeks: Math.floor(totalDays / 7), days: totalDays % 7 }
}

function calcFPP(fumStr: string): Date {
  return addDays(new Date(fumStr + 'T00:00:00'), 280)
}

function trimesterLabel(weeks: number): string {
  if (weeks <= 12) return '1er trimestre'
  if (weeks <= 27) return '2do trimestre'
  return '3er trimestre'
}

interface Props {
  patientId: string
  initialIsPregnant: boolean
  initialStartDate?: string
}

export default function PregnancyToggle({ patientId, initialIsPregnant, initialStartDate }: Props) {
  const [isPregnant, setIsPregnant] = useState(initialIsPregnant)
  const [fum, setFum] = useState(initialStartDate || '')
  const [showForm, setShowForm] = useState(false)
  const [editingFum, setEditingFum] = useState(false)
  const [loading, setLoading] = useState(false)

  async function save(pregnant: boolean, date?: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/patients/${patientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_pregnant: pregnant, pregnancy_start_date: date || null }),
      })
      if (!res.ok) throw new Error()
      setIsPregnant(pregnant)
      if (date !== undefined) setFum(date || '')
      toast.success(pregnant ? 'Embarazo registrado' : 'Embarazo removido')
    } catch {
      toast.error('No se pudo actualizar')
    } finally {
      setLoading(false)
      setShowForm(false)
      setEditingFum(false)
    }
  }

  // ── Full tracker ───────────────────────────────────────────────────────────
  if (isPregnant && fum && !editingFum) {
    const { weeks, days } = gestationalAge(fum)
    const fpp = calcFPP(fum)
    const daysLeft = Math.max(0, differenceInDays(fpp, new Date()))
    const progress = Math.min((weeks / 40) * 100, 100)
    const overdue = weeks >= 40

    return (
      <div className="bg-pink-400/5 border border-pink-400/20 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Seguimiento de embarazo</p>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
            overdue
              ? 'bg-red-400/20 border-red-400/40 text-red-400'
              : 'bg-pink-400/20 border-pink-400/40 text-pink-400'
          }`}>
            {overdue ? '¡Término alcanzado!' : `Semana ${weeks} · ${trimesterLabel(weeks)}`}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <p className="text-slate-500 text-xs mb-0.5">FUM</p>
            <p className="text-white text-sm font-medium">{formatDateShort(fum)}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-0.5">Fecha probable parto</p>
            <p className="text-white text-sm font-medium">{format(fpp, 'd MMM yyyy', { locale: es })}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-0.5">Semanas</p>
            <p className="text-white text-sm font-medium">{weeks} + {days}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-slate-600 mb-1.5">
            <span>1er trim.</span>
            <span>2do trim.</span>
            <span>3er trim.</span>
          </div>
          <div className="relative h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="absolute top-0 bottom-0 w-px bg-slate-700" style={{ left: '32.5%' }} />
            <div className="absolute top-0 bottom-0 w-px bg-slate-700" style={{ left: '70%' }} />
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-[#f06292] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-slate-500 text-xs mt-1.5 text-center">
            Semana {weeks} de 40
            {!overdue ? ` · faltan ${daysLeft} días` : ' · el parto es inminente'}
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-pink-400/10">
          <button
            onClick={() => setEditingFum(true)}
            className="flex items-center gap-1 text-slate-500 text-xs hover:text-slate-300 transition-colors"
          >
            <Pencil size={11} />
            Editar FUM
          </button>
          <button
            onClick={() => save(false)}
            disabled={loading}
            className="ml-auto text-slate-500 text-xs hover:text-red-400 transition-colors"
          >
            Quitar embarazo
          </button>
        </div>
      </div>
    )
  }

  // ── FUM form (add or edit) ─────────────────────────────────────────────────
  if (showForm || editingFum) {
    return (
      <div className="flex items-start gap-3 flex-wrap bg-pink-400/5 border border-pink-400/20 rounded-xl p-3">
        <div>
          <p className="text-slate-500 text-xs mb-1">FUM — Fecha de última menstruación</p>
          <input
            type="date"
            value={fum}
            onChange={e => setFum(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#f06292]"
          />
        </div>
        <div className="flex gap-2 mt-5">
          <button
            onClick={() => save(true, fum || undefined)}
            disabled={loading || !fum}
            className="px-3 py-1.5 rounded-lg bg-pink-500 text-white text-xs font-medium hover:bg-pink-600 transition-colors disabled:opacity-50"
          >
            {loading ? '...' : 'Guardar'}
          </button>
          <button
            onClick={() => { setShowForm(false); setEditingFum(false) }}
            className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-xs hover:text-white transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  // ── Pregnant, no FUM yet ───────────────────────────────────────────────────
  if (isPregnant && !fum) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-pink-400 text-xs">🤰 Embarazada</span>
        <button onClick={() => setEditingFum(true)} className="text-[#f06292] text-xs underline">
          Ingresar FUM para seguimiento
        </button>
        <button onClick={() => save(false)} disabled={loading} className="text-slate-500 text-xs hover:text-red-400 ml-2">
          Quitar
        </button>
      </div>
    )
  }

  // ── Not pregnant ───────────────────────────────────────────────────────────
  return (
    <button
      onClick={() => setShowForm(true)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700 text-slate-400 hover:text-pink-400 hover:border-pink-400/40 transition-colors text-xs"
    >
      🤰 Marcar embarazo
    </button>
  )
}
