'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, CalendarDays } from 'lucide-react'
import { Appointment } from '@/lib/types'
import { formatTime, getStatusColor, getStatusLabel, getServiceLabel, getInitials } from '@/lib/utils'

interface DayGroup {
  date: string
  label: string
  appts: Appointment[]
}

export default function UpcomingAppointments({ groups }: { groups: DayGroup[] }) {
  const [open, setOpen] = useState(false)

  const totalAppts = groups.reduce((s, g) => s + g.appts.length, 0)

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden mb-6">
      {/* Toggle header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <CalendarDays size={15} className="text-slate-400" />
          <span className="text-white font-semibold text-sm">Próximas citas</span>
          <span className="bg-[#f06292]/20 border border-[#f06292]/30 text-[#f06292] text-xs font-medium px-2 py-0.5 rounded-full">
            {totalAppts}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-xs">{groups.length} día{groups.length !== 1 ? 's' : ''}</span>
          {open
            ? <ChevronUp size={15} className="text-slate-400" />
            : <ChevronDown size={15} className="text-slate-400" />}
        </div>
      </button>

      {/* Content */}
      {open && (
        <div className="border-t border-slate-700 divide-y divide-slate-700/50">
          {groups.map(({ date, label, appts }) => (
            <div key={date}>
              {/* Day header */}
              <div className="px-4 py-2 bg-slate-900/40 flex items-center justify-between">
                <p className="text-slate-300 text-xs font-semibold capitalize">{label}</p>
                <span className="text-slate-600 text-xs">{appts.length} cita{appts.length !== 1 ? 's' : ''}</span>
              </div>
              {/* Appointments */}
              {appts.map(appt => (
                <Link
                  key={appt.id}
                  href={`/dashboard/pacientes/${appt.patient_id}`}
                  className="px-4 py-3 flex items-center gap-3 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="text-right flex-shrink-0 w-14">
                    <p className="text-white text-sm font-medium">{formatTime(appt.appointment_time)}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#f06292]/20 border border-[#f06292]/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#f06292] text-xs font-bold">
                      {getInitials(appt.patient?.name || 'P')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {appt.patient?.name || 'Paciente'}
                    </p>
                    <p className="text-slate-400 text-xs truncate">
                      {getServiceLabel(appt.service_type)}
                      {appt.is_first_visit && <span className="ml-1.5 text-[#f06292]">· Primera vez</span>}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium border flex-shrink-0 hidden sm:inline-flex ${getStatusColor(appt.status)}`}>
                    {getStatusLabel(appt.status)}
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
