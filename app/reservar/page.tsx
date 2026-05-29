'use client'

import { useState, useEffect } from 'react'
import { addDays, format, parseISO, startOfDay, isBefore } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Clock, User, Phone, Mail, CreditCard, ChevronRight, ChevronLeft, CheckCircle, Loader2, Heart, FileText } from 'lucide-react'

const SERVICES = [
  { value: 'control-prenatal', label: 'Control Prenatal' },
  { value: 'ginecologia', label: 'Ginecología General' },
  { value: 'fertilidad', label: 'Fertilidad / Reproducción' },
  { value: 'planificacion', label: 'Planificación Familiar' },
  { value: 'menopausia', label: 'Menopausia y Climaterio' },
  { value: 'otro', label: 'Otro / Consulta general' },
]

const SLOT_LABELS: Record<string, string> = {
  '08:00': '8:00 AM', '09:00': '9:00 AM', '10:00': '10:00 AM', '11:00': '11:00 AM',
  '14:00': '2:00 PM', '15:00': '3:00 PM', '16:00': '4:00 PM',
}

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function toDateStr(d: Date): string {
  return format(d, 'yyyy-MM-dd')
}

function buildCalendarDays(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startDow = first.getDay() // 0=Sun
  const cells: (Date | null)[] = Array(startDow).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  // pad to full rows
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

type Step = 'form' | 'success'

export default function ReservarPage() {
  const today = startOfDay(new Date())
  const maxDate = addDays(today, 60)

  const [step, setStep] = useState<Step>('form')
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [confirmedData, setConfirmedData] = useState<{ date: string; time: string; service: string; name: string } | null>(null)

  const [form, setForm] = useState({
    name: '', cedula: '', phone: '', email: '', service: '', notes: '',
  })

  const calDays = buildCalendarDays(calYear, calMonth)

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

  useEffect(() => {
    if (!selectedDate) return
    setLoadingSlots(true)
    setSelectedTime('')
    fetch(`/api/availability?date=${selectedDate}`)
      .then(r => r.json())
      .then(d => setAvailableSlots(d.available || []))
      .finally(() => setLoadingSlots(false))
  }, [selectedDate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('El nombre es requerido'); return }
    if (!form.phone.trim()) { setError('El teléfono es requerido'); return }
    if (!form.service) { setError('Selecciona el tipo de consulta'); return }
    if (!selectedDate) { setError('Selecciona una fecha'); return }
    if (!selectedTime) { setError('Selecciona un horario'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, date: selectedDate, time: selectedTime }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al agendar'); return }
      setConfirmedData({ date: selectedDate, time: selectedTime, service: form.service, name: form.name })
      setStep('success')
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'success' && confirmedData) {
    const dateObj = parseISO(confirmedData.date)
    const serviceLabel = SERVICES.find(s => s.value === confirmedData.service)?.label || confirmedData.service
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">¡Cita confirmada!</h1>
          <p className="text-gray-500 mb-6 text-sm">Revisa tu correo para el comprobante</p>
          <div className="bg-pink-50 rounded-xl p-4 text-left space-y-3 mb-6">
            <Row icon={<User size={15} className="text-[#f06292]" />} label="Paciente" value={confirmedData.name} />
            <Row icon={<Calendar size={15} className="text-[#f06292]" />} label="Fecha" value={format(dateObj, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })} capitalize />
            <Row icon={<Clock size={15} className="text-[#f06292]" />} label="Hora" value={SLOT_LABELS[confirmedData.time]} />
            <Row icon={<FileText size={15} className="text-[#f06292]" />} label="Servicio" value={serviceLabel} />
          </div>
          <p className="text-xs text-gray-400">Consultorio Dra. Hilda Mary Díaz García · Maturín, Estado Monagas</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#f06292]/10 border border-[#f06292]/20 flex items-center justify-center">
            <Heart size={20} className="text-[#f06292]" fill="currentColor" />
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight text-sm">Dra. Hilda Mary Díaz García</p>
            <p className="text-xs text-gray-500">Ginecología y Obstetricia · Maturín, Venezuela</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Agendar consulta</h1>
          <p className="text-gray-500 text-sm mt-1">Completa el formulario para reservar tu cita</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Service */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <FileText size={15} className="text-[#f06292]" />
              Tipo de consulta
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {SERVICES.map(s => (
                <button key={s.value} type="button"
                  onClick={() => setForm(f => ({ ...f, service: s.value }))}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                    form.service === s.value
                      ? 'border-[#f06292] bg-[#f06292]/10 text-[#f06292]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 text-sm mb-4 flex items-center gap-2">
              <Calendar size={15} className="text-[#f06292]" />
              Fecha
            </h2>

            {/* Month nav */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-900 capitalize">
                {format(new Date(calYear, calMonth, 1), 'MMMM yyyy', { locale: es })}
              </p>
              <div className="flex gap-1">
                <button type="button" onClick={prevMonth} disabled={!canGoPrev}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft size={14} />
                </button>
                <button type="button" onClick={nextMonth}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 transition-colors">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAY_NAMES.map(d => (
                <div key={d} className={`text-center text-xs font-medium py-1 ${d === 'Dom' || d === 'Sáb' ? 'text-gray-300' : 'text-gray-400'}`}>
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-y-1">
              {calDays.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />
                const dow = day.getDay()
                const isWeekendDay = dow === 0 || dow === 6
                const isPast = isBefore(startOfDay(day), today)
                const isTooFar = isBefore(maxDate, startOfDay(day))
                const disabled = isWeekendDay || isPast || isTooFar
                const dateStr = toDateStr(day)
                const isSelected = selectedDate === dateStr
                const isToday = toDateStr(day) === toDateStr(today)

                return (
                  <button
                    key={dateStr}
                    type="button"
                    disabled={disabled}
                    onClick={() => { setSelectedDate(dateStr) }}
                    className={`
                      mx-auto w-9 h-9 rounded-xl text-sm font-medium flex items-center justify-center transition-all
                      ${isSelected ? 'bg-[#f06292] text-white shadow-md' : ''}
                      ${!isSelected && isToday ? 'border border-[#f06292] text-[#f06292]' : ''}
                      ${!isSelected && !isToday && !disabled ? 'text-gray-800 hover:bg-gray-100' : ''}
                      ${disabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {day.getDate()}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Time slots */}
          {selectedDate && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <Clock size={15} className="text-[#f06292]" />
                Horario disponible
              </h2>
              {loadingSlots ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm py-4 justify-center">
                  <Loader2 size={16} className="animate-spin" /> Verificando disponibilidad...
                </div>
              ) : availableSlots.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No hay horarios disponibles para este día</p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map(slot => (
                    <button key={slot} type="button" onClick={() => setSelectedTime(slot)}
                      className={`py-2.5 rounded-xl border text-xs font-medium transition-all ${
                        selectedTime === slot
                          ? 'border-[#f06292] bg-[#f06292] text-white'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}>
                      {SLOT_LABELS[slot]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Patient info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <User size={15} className="text-[#f06292]" />
              Datos personales
            </h2>
            <div className="space-y-3">
              <Field icon={<User size={14} />} label="Nombre completo *">
                <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Tu nombre completo"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#f06292] transition-colors" />
              </Field>
              <Field icon={<CreditCard size={14} />} label="Cédula de identidad">
                <input type="text" value={form.cedula} onChange={e => setForm(f => ({ ...f, cedula: e.target.value }))} placeholder="Ej: V-12345678"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#f06292] transition-colors" />
              </Field>
              <Field icon={<Phone size={14} />} label="Teléfono / WhatsApp *">
                <input type="tel" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Ej: 04121234567"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#f06292] transition-colors" />
              </Field>
              <Field icon={<Mail size={14} />} label="Correo electrónico (para confirmación)">
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="correo@ejemplo.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#f06292] transition-colors" />
              </Field>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Motivo de consulta (opcional)</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Describe brevemente el motivo de tu visita..." rows={3}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#f06292] transition-colors resize-none" />
              </div>
            </div>
          </div>

          {/* Summary */}
          {selectedDate && selectedTime && form.service && (
            <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4">
              <p className="text-xs font-semibold text-[#f06292] uppercase tracking-wide mb-2">Resumen de tu cita</p>
              <div className="space-y-1 text-sm text-gray-700">
                <p><span className="text-gray-500">Fecha: </span>
                  <span className="font-medium capitalize">{format(parseISO(selectedDate), "EEEE d 'de' MMMM", { locale: es })}</span></p>
                <p><span className="text-gray-500">Hora: </span><span className="font-medium">{SLOT_LABELS[selectedTime]}</span></p>
                <p><span className="text-gray-500">Servicio: </span><span className="font-medium">{SERVICES.find(s => s.value === form.service)?.label}</span></p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{error}</div>
          )}

          <button type="submit" disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#f06292] text-white font-semibold text-sm hover:bg-[#e91e8c] disabled:opacity-60 transition-colors shadow-lg shadow-pink-200">
            {submitting
              ? <><Loader2 size={16} className="animate-spin" />Agendando...</>
              : <>Confirmar cita <ChevronRight size={16} /></>}
          </button>

          <p className="text-center text-xs text-gray-400 pb-4">
            Al agendar aceptas ser contactada por el consultorio para confirmar o reprogramar tu cita.
          </p>
        </form>
      </div>
    </div>
  )
}

function Row({ icon, label, value, capitalize }: { icon: React.ReactNode; label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className={`text-sm font-medium text-gray-900 ${capitalize ? 'capitalize' : ''}`}>{value}</p>
      </div>
    </div>
  )
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
        {children}
      </div>
    </div>
  )
}
