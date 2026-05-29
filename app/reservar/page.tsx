'use client'

import { useState, useEffect } from 'react'
import { addDays, format, isWeekend, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Clock, User, Phone, Mail, CreditCard, ChevronRight, CheckCircle, Loader2, Heart, FileText } from 'lucide-react'

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

function getWeekdays(count: number): Date[] {
  const dates: Date[] = []
  let d = addDays(new Date(), 1)
  while (dates.length < count) {
    if (!isWeekend(d)) dates.push(new Date(d))
    d = addDays(d, 1)
  }
  return dates
}

type Step = 'form' | 'success'

export default function ReservarPage() {
  const [step, setStep] = useState<Step>('form')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [confirmedData, setConfirmedData] = useState<{ date: string; time: string; service: string; name: string } | null>(null)

  const [form, setForm] = useState({
    name: '',
    cedula: '',
    phone: '',
    email: '',
    service: '',
    notes: '',
  })

  const weekdays = getWeekdays(30)

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
        body: JSON.stringify({
          ...form,
          date: selectedDate,
          time: selectedTime,
        }),
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
            <div className="flex items-center gap-3">
              <User size={16} className="text-[#f06292] flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Paciente</p>
                <p className="text-sm font-medium text-gray-900">{confirmedData.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-[#f06292] flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Fecha</p>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {format(dateObj, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-[#f06292] flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Hora</p>
                <p className="text-sm font-medium text-gray-900">{SLOT_LABELS[confirmedData.time]}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText size={16} className="text-[#f06292] flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Servicio</p>
                <p className="text-sm font-medium text-gray-900">{serviceLabel}</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            Consultorio Dra. Hilda Mary Díaz García · Maturín, Estado Monagas
          </p>
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
                <button
                  key={s.value}
                  type="button"
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

          {/* Date */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <Calendar size={15} className="text-[#f06292]" />
              Fecha
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {weekdays.map(d => {
                const dateStr = format(d, 'yyyy-MM-dd')
                const isSelected = selectedDate === dateStr
                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelectedDate(dateStr)}
                    className={`flex-shrink-0 flex flex-col items-center px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-[#f06292] bg-[#f06292] text-white'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <span className={`text-xs mb-0.5 capitalize ${isSelected ? 'text-pink-100' : 'text-gray-400'}`}>
                      {format(d, 'EEE', { locale: es })}
                    </span>
                    <span className="text-sm font-bold">{format(d, 'd')}</span>
                    <span className={`text-xs capitalize ${isSelected ? 'text-pink-100' : 'text-gray-400'}`}>
                      {format(d, 'MMM', { locale: es })}
                    </span>
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
                  <Loader2 size={16} className="animate-spin" />
                  Verificando disponibilidad...
                </div>
              ) : availableSlots.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No hay horarios disponibles para este día</p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2.5 rounded-xl border text-xs font-medium transition-all ${
                        selectedTime === slot
                          ? 'border-[#f06292] bg-[#f06292] text-white'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
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
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nombre completo *</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Tu nombre completo"
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#f06292] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Cédula de identidad</label>
                <div className="relative">
                  <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={form.cedula}
                    onChange={e => setForm(f => ({ ...f, cedula: e.target.value }))}
                    placeholder="Ej: V-12345678"
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#f06292] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Teléfono / WhatsApp *</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="Ej: 04121234567"
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#f06292] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Correo electrónico (para confirmación)</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="correo@ejemplo.com"
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#f06292] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Motivo de consulta (opcional)</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Describe brevemente el motivo de tu visita..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#f06292] transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Summary before submit */}
          {selectedDate && selectedTime && form.service && (
            <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4">
              <p className="text-xs font-semibold text-[#f06292] uppercase tracking-wide mb-2">Resumen de tu cita</p>
              <div className="space-y-1 text-sm text-gray-700">
                <p><span className="text-gray-500">Fecha:</span> <span className="font-medium capitalize">{format(parseISO(selectedDate), "EEEE d 'de' MMMM", { locale: es })}</span></p>
                <p><span className="text-gray-500">Hora:</span> <span className="font-medium">{SLOT_LABELS[selectedTime]}</span></p>
                <p><span className="text-gray-500">Servicio:</span> <span className="font-medium">{SERVICES.find(s => s.value === form.service)?.label}</span></p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#f06292] text-white font-semibold text-sm hover:bg-[#e91e8c] disabled:opacity-60 transition-colors shadow-lg shadow-pink-200"
          >
            {submitting ? (
              <><Loader2 size={16} className="animate-spin" />Agendando...</>
            ) : (
              <>Confirmar cita <ChevronRight size={16} /></>
            )}
          </button>

          <p className="text-center text-xs text-gray-400 pb-4">
            Al agendar aceptas ser contactada por el consultorio para confirmar o reprogramar tu cita.
          </p>
        </form>
      </div>
    </div>
  )
}
