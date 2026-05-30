'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format, addDays, startOfDay, isBefore } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowLeft, ChevronLeft, ChevronRight, Ban, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

export const dynamic = 'force-dynamic'

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function buildCalendarDays(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (Date | null)[] = Array(first.getDay()).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function toDateStr(d: Date) { return format(d, 'yyyy-MM-dd') }

interface BlockedDate { id: string; date: string; reason?: string }

export default function DisponibilidadPage() {
  const today = startOfDay(new Date())
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [blocked, setBlocked] = useState<BlockedDate[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/blocked-dates')
      .then(r => r.json())
      .then(d => setBlocked(d))
      .finally(() => setLoading(false))
  }, [])

  const blockedSet = new Set(blocked.map(b => b.date))

  const canGoPrev = !(calYear === today.getFullYear() && calMonth === today.getMonth())
  function prevMonth() {
    if (!canGoPrev) return
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11) }
    else setCalMonth(m => m - 1)
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0) }
    else setCalMonth(m => m + 1)
  }

  async function toggleDate(dateStr: string) {
    setToggling(dateStr)
    try {
      if (blockedSet.has(dateStr)) {
        const entry = blocked.find(b => b.date === dateStr)!
        const res = await fetch(`/api/blocked-dates/${entry.id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error()
        setBlocked(prev => prev.filter(b => b.id !== entry.id))
        toast.success('Día desbloqueado')
      } else {
        const res = await fetch('/api/blocked-dates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: dateStr }),
        })
        if (!res.ok) throw new Error()
        const newEntry = await res.json()
        setBlocked(prev => [...prev, newEntry])
        toast.success('Día bloqueado')
      }
    } catch {
      toast.error('Error al guardar')
    } finally {
      setToggling(null)
    }
  }

  const calDays = buildCalendarDays(calYear, calMonth)
  const maxDate = addDays(today, 365)

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <Link href="/dashboard/configuracion/precios"
        className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-5 transition-colors">
        <ArrowLeft size={15} /> Configuración
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
          <Ban size={18} className="text-red-400" />
        </div>
        <div>
          <h1 className="text-white text-xl font-bold">Días no disponibles</h1>
          <p className="text-slate-400 text-sm">Toca un día para bloquearlo o desbloquearlo</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mb-4">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-white font-semibold capitalize">
            {format(new Date(calYear, calMonth, 1), 'MMMM yyyy', { locale: es })}
          </p>
          <div className="flex gap-1">
            <button onClick={prevMonth} disabled={!canGoPrev}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white disabled:opacity-30 transition-colors">
              <ChevronLeft size={14} />
            </button>
            <button onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAY_NAMES.map(d => (
            <div key={d} className={`text-center text-xs font-medium py-1 ${d === 'Dom' || d === 'Sáb' ? 'text-slate-600' : 'text-slate-500'}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={20} className="animate-spin text-slate-500" />
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-y-1">
            {calDays.map((day, i) => {
              if (!day) return <div key={`e-${i}`} />
              const dow = day.getDay()
              const isWeekend = dow === 0 || dow === 6
              const isPast = isBefore(startOfDay(day), today)
              const isTooFar = isBefore(maxDate, startOfDay(day))
              const dateStr = toDateStr(day)
              const isBlocked = blockedSet.has(dateStr)
              const isToggling = toggling === dateStr
              const isToday = dateStr === toDateStr(today)

              return (
                <button
                  key={dateStr}
                  disabled={isWeekend || isPast || isTooFar || isToggling}
                  onClick={() => toggleDate(dateStr)}
                  title={isBlocked ? 'Click para desbloquear' : 'Click para bloquear'}
                  className={`
                    mx-auto w-10 h-10 rounded-xl text-sm font-medium flex items-center justify-center transition-all relative
                    ${isWeekend || isPast ? 'text-slate-700 cursor-default' : 'cursor-pointer'}
                    ${isBlocked && !isWeekend && !isPast ? 'bg-red-500/30 border border-red-500/60 text-red-400 hover:bg-red-500/40' : ''}
                    ${!isBlocked && !isWeekend && !isPast ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : ''}
                    ${isToday && !isBlocked ? 'border border-[#f06292] text-[#f06292]' : ''}
                  `}
                >
                  {isToggling ? <Loader2 size={13} className="animate-spin" /> : day.getDate()}
                  {isBlocked && !isWeekend && !isPast && (
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                      <X size={8} className="text-white" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-red-500/30 border border-red-500/60" />
            <span className="text-slate-400 text-xs">Bloqueado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded border border-[#f06292]" />
            <span className="text-slate-400 text-xs">Hoy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-slate-700" />
            <span className="text-slate-400 text-xs">Disponible</span>
          </div>
        </div>
      </div>

      {/* List of blocked dates */}
      {blocked.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700">
            <p className="text-white text-sm font-semibold">
              {blocked.length} día{blocked.length !== 1 ? 's' : ''} bloqueado{blocked.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="divide-y divide-slate-700">
            {[...blocked]
              .sort((a, b) => a.date.localeCompare(b.date))
              .map(b => (
                <div key={b.id} className="flex items-center justify-between px-4 py-3">
                  <p className="text-white text-sm capitalize">
                    {format(new Date(b.date + 'T12:00:00'), "EEEE d 'de' MMMM yyyy", { locale: es })}
                  </p>
                  <button
                    onClick={() => toggleDate(b.date)}
                    disabled={toggling === b.date}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1"
                  >
                    {toggling === b.date ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
