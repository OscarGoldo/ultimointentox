'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Appointment } from '@/lib/types'
import AppointmentRow from './AppointmentRow'
import NewAppointmentModal from './NewAppointmentModal'

interface Props {
  defaultDate: string
  initialAppointments: Appointment[]
}

export default function AppointmentSection({ defaultDate, initialAppointments }: Props) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [open, setOpen] = useState(false)

  function handleCreated(appt: Appointment) {
    setAppointments((prev) =>
      [...prev, appt].sort((a, b) =>
        a.appointment_time.localeCompare(b.appointment_time)
      )
    )
    setOpen(false)
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden mb-6">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <h2 className="text-white font-semibold text-sm">Agenda de hoy</h2>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-xs">{appointments.length} citas</span>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f06292]/20 border border-[#f06292]/40 text-[#f06292] text-xs font-medium hover:bg-[#f06292]/30 transition-colors"
          >
            <Plus size={13} />
            Nueva cita
          </button>
        </div>
      </div>

      {/* List */}
      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <span className="text-4xl mb-3">📅</span>
          <p className="text-slate-400 font-medium">Sin citas para hoy</p>
          <p className="text-slate-600 text-sm mt-1">El día está libre</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-700">
          {appointments.map((appt) => (
            <AppointmentRow key={appt.id} appointment={appt} />
          ))}
        </div>
      )}

      {open && (
        <NewAppointmentModal
          defaultDate={defaultDate}
          onClose={() => setOpen(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}
