'use client'

import { useState } from 'react'
import { Appointment } from '@/lib/types'
import { formatTime, getStatusColor, getStatusLabel, getServiceLabel, getInitials } from '@/lib/utils'
import { CheckCircle, XCircle } from 'lucide-react'
import AttendanceModal from './AttendanceModal'
import AppointmentDetailModal from './AppointmentDetailModal'

interface Props {
  appointment: Appointment
}

export default function AppointmentRow({ appointment }: Props) {
  const [showAttendance, setShowAttendance] = useState(false)
  const [attendanceType, setAttendanceType] = useState<'completed' | 'no_show'>('completed')
  const [showDetail, setShowDetail] = useState(false)
  const [currentAppt, setCurrentAppt] = useState(appointment)

  // Determine if appointment time has passed
  const now = new Date()
  const [hours, minutes] = appointment.appointment_time.split(':').map(Number)
  const apptTime = new Date()
  apptTime.setHours(hours, minutes, 0, 0)
  const timePassed = now > apptTime
  const canMarkAttendance =
    timePassed &&
    (currentAppt.status === 'scheduled' || currentAppt.status === 'confirmed')

  function handleVino() {
    setAttendanceType('completed')
    setShowAttendance(true)
  }

  function handleNoVino() {
    setAttendanceType('no_show')
    setShowAttendance(true)
  }

  return (
    <>
      <div
        className="px-4 py-3 hover:bg-slate-700/50 transition-colors cursor-pointer"
        onClick={() => setShowDetail(true)}
      >
        <div className="flex items-center gap-3">
          {/* Time */}
          <div className="text-right flex-shrink-0 w-14">
            <p className="text-white text-sm font-medium">
              {formatTime(currentAppt.appointment_time)}
            </p>
          </div>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-[#f06292]/20 border border-[#f06292]/30 flex items-center justify-center flex-shrink-0">
            <span className="text-[#f06292] text-xs font-bold">
              {getInitials(currentAppt.patient?.name || 'P')}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {currentAppt.patient?.name || 'Paciente'}
            </p>
            <p className="text-slate-400 text-xs truncate">
              {getServiceLabel(currentAppt.service_type)}
              {currentAppt.is_first_visit && (
                <span className="ml-1.5 text-[#f06292]">· Primera vez</span>
              )}
            </p>
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium border hidden sm:inline-flex ${getStatusColor(currentAppt.status)}`}
            >
              {getStatusLabel(currentAppt.status)}
            </span>

            {/* Action buttons */}
            {canMarkAttendance && (
              <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={handleVino}
                  title="Marcá que vino"
                  className="p-1.5 rounded-lg bg-emerald-400/20 text-emerald-400 hover:bg-emerald-400/30 transition-colors"
                >
                  <CheckCircle size={15} />
                </button>
                <button
                  onClick={handleNoVino}
                  title="No se presentó"
                  className="p-1.5 rounded-lg bg-red-400/20 text-red-400 hover:bg-red-400/30 transition-colors"
                >
                  <XCircle size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAttendance && (
        <AttendanceModal
          appointment={currentAppt}
          type={attendanceType}
          onClose={() => setShowAttendance(false)}
          onUpdated={(updated) => {
            setCurrentAppt(updated)
            setShowAttendance(false)
          }}
        />
      )}

      {showDetail && (
        <AppointmentDetailModal
          appointment={currentAppt}
          onClose={() => setShowDetail(false)}
          onUpdated={(updated) => setCurrentAppt(updated)}
        />
      )}
    </>
  )
}
