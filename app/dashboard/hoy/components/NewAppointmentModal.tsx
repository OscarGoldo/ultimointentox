'use client'

import { useState } from 'react'
import { X, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Appointment } from '@/lib/types'
import { SERVICE_LABELS } from '@/lib/utils'

interface Props {
  defaultDate: string
  onClose: () => void
  onCreated: (appt: Appointment) => void
}

const SERVICES = Object.entries(SERVICE_LABELS)

export default function NewAppointmentModal({ defaultDate, onClose, onCreated }: Props) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    cedula: '',
    phone: '',
    email: '',
    appointment_date: defaultDate,
    appointment_time: '',
    service_type: 'ginecologia',
    is_first_visit: false,
    notes: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('El nombre es requerido')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          // If no time provided use 00:00 as placeholder
          appointment_time: form.appointment_time || '00:00',
          cedula: form.cedula || undefined,
          phone: form.phone || undefined,
          email: form.email || undefined,
          notes: form.notes || undefined,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Error al crear la cita')
      }

      const appt = await res.json()
      toast.success('Cita registrada correctamente')
      onCreated(appt)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear la cita')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#f06292] transition-colors text-sm'

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-[#f06292]" />
            <h2 className="text-white font-semibold text-sm">Nueva cita manual</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">

          {/* Paciente */}
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">Datos del paciente</p>
            <div className="space-y-2">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Nombre completo *"
                className={inputCls}
              />
              <input
                name="cedula"
                value={form.cedula}
                onChange={handleChange}
                placeholder="Cédula de identidad (opcional)"
                className={inputCls}
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Teléfono / WhatsApp (opcional)"
                className={inputCls}
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Correo electrónico (opcional)"
                className={inputCls}
              />
            </div>
          </div>

          {/* Cita */}
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">Detalles de la cita</p>
            <div className="space-y-2">
              <div>
                <label className="text-slate-500 text-xs mb-1 block">Servicio</label>
                <select name="service_type" value={form.service_type} onChange={handleChange} className={inputCls}>
                  {SERVICES.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">Fecha *</label>
                  <input
                    name="appointment_date"
                    type="date"
                    value={form.appointment_date}
                    onChange={handleChange}
                    required
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-slate-500 text-xs mb-1 flex items-center gap-1">
                    Hora
                    <span className="text-slate-600 font-normal">(opcional)</span>
                  </label>
                  <input
                    name="appointment_time"
                    type="time"
                    value={form.appointment_time}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>
              </div>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Motivo de consulta / notas (opcional)"
                rows={2}
                className={`${inputCls} resize-none`}
              />

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  name="is_first_visit"
                  type="checkbox"
                  checked={form.is_first_visit}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-[#f06292]"
                />
                <span className="text-slate-300 text-sm">Primera visita</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-[#f06292] hover:bg-[#e91e8c] disabled:opacity-50 text-white font-semibold text-sm transition-colors"
            >
              {loading ? 'Guardando...' : 'Registrar cita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
