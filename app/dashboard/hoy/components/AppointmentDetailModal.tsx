'use client'

import { Appointment } from '@/lib/types'
import {
  X,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Calendar,
  DollarSign,
  User,
} from 'lucide-react'
import {
  formatDate,
  formatTime,
  formatCurrency,
  getStatusColor,
  getStatusLabel,
  getServiceLabel,
  getPaymentLabel,
  buildWhatsAppUrl,
  getInitials,
} from '@/lib/utils'

interface Props {
  appointment: Appointment
  onClose: () => void
  onUpdated: (updated: Appointment) => void
}

export default function AppointmentDetailModal({ appointment, onClose }: Props) {
  const patient = appointment.patient
  const phone = patient?.phone || ''

  const waMessage = `Hola ${patient?.name?.split(' ')[0] || ''}, le escribimos del consultorio de la Dra. Hilda Díaz García para confirmar su cita del ${formatDate(appointment.appointment_date)} a las ${formatTime(appointment.appointment_time)}.`

  const waUrl = phone ? buildWhatsAppUrl(phone, waMessage) : null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 sticky top-0 bg-slate-800">
          <h2 className="text-white font-semibold text-sm">Detalle de cita</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Patient avatar + name */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#f06292]/20 border border-[#f06292]/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[#f06292] text-lg font-bold">
                {getInitials(patient?.name || 'P')}
              </span>
            </div>
            <div>
              <p className="text-white font-semibold">{patient?.name || 'Paciente'}</p>
              {appointment.is_first_visit && (
                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-[#f06292]/20 text-[#f06292] border border-[#f06292]/30">
                  Primera visita
                </span>
              )}
            </div>
          </div>

          {/* Status badge */}
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium border ${getStatusColor(appointment.status)}`}
          >
            {getStatusLabel(appointment.status)}
          </span>

          {/* Details grid */}
          <div className="space-y-3">
            <DetailRow icon={<Calendar size={15} />} label="Fecha">
              {formatDate(appointment.appointment_date)}
            </DetailRow>
            <DetailRow icon={<Clock size={15} />} label="Hora">
              {formatTime(appointment.appointment_time)}
            </DetailRow>
            <DetailRow icon={<User size={15} />} label="Servicio">
              {getServiceLabel(appointment.service_type)}
            </DetailRow>

            {appointment.revenue != null && (
              <DetailRow icon={<DollarSign size={15} />} label="Pago">
                {formatCurrency(appointment.revenue)} · {getPaymentLabel(appointment.payment_method)}
              </DetailRow>
            )}

            {appointment.payment_notes && (
              <div className="bg-slate-900 rounded-xl p-3">
                <p className="text-slate-400 text-xs mb-1">Notas de pago</p>
                <p className="text-white text-sm">{appointment.payment_notes}</p>
              </div>
            )}

            {appointment.notes && (
              <div className="bg-slate-900 rounded-xl p-3">
                <p className="text-slate-400 text-xs mb-1">Notas</p>
                <p className="text-white text-sm">{appointment.notes}</p>
              </div>
            )}
          </div>

          {/* Contact actions */}
          {patient && (
            <div className="pt-2 space-y-2">
              {phone && (
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors text-sm font-medium"
                  >
                    <Phone size={15} />
                    Llamar
                  </a>
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-colors text-sm font-medium"
                    >
                      <MessageCircle size={15} />
                      WhatsApp
                    </a>
                  )}
                </div>
              )}
              {patient.email && (
                <a
                  href={`mailto:${patient.email}`}
                  className="flex items-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors text-sm"
                >
                  <Mail size={15} />
                  {patient.email}
                </a>
              )}
            </div>
          )}

          {/* View full patient */}
          {appointment.patient_id && (
            <a
              href={`/dashboard/pacientes/${appointment.patient_id}`}
              className="block text-center text-[#f06292] text-sm hover:underline"
            >
              Ver historial completo →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-slate-500 mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-slate-500 text-xs">{label}</p>
        <p className="text-white text-sm mt-0.5">{children}</p>
      </div>
    </div>
  )
}
