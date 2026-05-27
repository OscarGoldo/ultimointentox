'use client'

import { useState } from 'react'
import { Appointment, PaymentMethod } from '@/lib/types'
import { X, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  appointment: Appointment
  type: 'completed' | 'no_show'
  onClose: () => void
  onUpdated: (updated: Appointment) => void
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'zelle', label: 'Zelle' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'binance', label: 'Binance' },
  { value: 'otro', label: 'Otro' },
]

export default function AttendanceModal({ appointment, type, onClose, onUpdated }: Props) {
  const [revenue, setRevenue] = useState<string>(appointment.revenue?.toString() || '60')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo')
  const [paymentNotes, setPaymentNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const isCompleted = type === 'completed'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const body: Record<string, unknown> = { status: type }
      if (isCompleted) {
        body.revenue = parseFloat(revenue) || 0
        body.payment_method = paymentMethod
        body.payment_notes = paymentNotes
      }

      const res = await fetch(`/api/appointments/${appointment.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error('Error al actualizar')

      const updated = await res.json()
      toast.success(isCompleted ? '✓ Cita marcada como completada' : 'Registrado: no se presentó')
      onUpdated(updated)
    } catch {
      toast.error('No se pudo actualizar la cita')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <CheckCircle size={18} className="text-emerald-400" />
            ) : (
              <XCircle size={18} className="text-red-400" />
            )}
            <h2 className="text-white font-semibold text-sm">
              {isCompleted ? '¿Vino a la cita?' : '¿No se presentó?'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Patient info */}
          <div className="bg-slate-900 rounded-xl p-3">
            <p className="text-white font-medium text-sm">{appointment.patient?.name}</p>
            <p className="text-slate-400 text-xs mt-0.5">
              {appointment.appointment_time} · {appointment.service_type || 'Sin especificar'}
            </p>
          </div>

          {isCompleted ? (
            <>
              {/* Revenue */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Monto cobrado (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full pl-7 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#f06292] transition-colors text-sm"
                  />
                </div>
              </div>

              {/* Payment method */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Método de pago
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPaymentMethod(value)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors ${
                        paymentMethod === value
                          ? 'bg-[#f06292]/20 border-[#f06292]/50 text-[#f06292]'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">
                  Notas de pago (opcional)
                </label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Número de confirmación, etc."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-[#f06292] transition-colors text-sm"
                />
              </div>
            </>
          ) : (
            <p className="text-slate-400 text-sm">
              Se marcará esta cita como no presentada. Esto se reflejará en las estadísticas del mes.
            </p>
          )}

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
              className={`flex-1 py-2.5 rounded-xl text-white font-medium text-sm transition-colors disabled:opacity-50 ${
                isCompleted
                  ? 'bg-emerald-500 hover:bg-emerald-600'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {loading ? 'Guardando...' : isCompleted ? 'Confirmar visita' : 'Marcar ausencia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
