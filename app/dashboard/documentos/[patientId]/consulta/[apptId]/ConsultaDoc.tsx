'use client'

import Link from 'next/link'
import { ArrowLeft, Printer } from 'lucide-react'
import { Patient, Appointment, Study } from '@/lib/types'
import { formatDate, formatTime, getServiceLabel } from '@/lib/utils'

function isImage(fileName: string | null | undefined) {
  return /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(fileName || '')
}

function Letterhead() {
  return (
    <div className="flex items-start justify-between pb-4 mb-5 border-b-2 border-gray-800">
      <div>
        <p className="text-xs text-gray-500 mb-0.5">República Bolivariana de Venezuela</p>
        <h1 className="text-base font-bold text-gray-900 leading-tight">Dra. Hilda Mary Díaz García</h1>
        <p className="text-sm text-gray-600">Médico Especialista en Ginecología y Obstetricia</p>
        <p className="text-xs text-gray-500 mt-0.5">MPPS: ___________</p>
      </div>
      <div className="text-right text-xs text-gray-500">
        <p className="font-semibold text-gray-700">Consultorio médico</p>
        <p>Maturín, Estado Monagas</p>
        <p>Venezuela</p>
      </div>
    </div>
  )
}

function Signature() {
  return (
    <div className="mt-16 text-center">
      <div className="inline-block border-t border-gray-400 pt-2 px-8">
        <p className="text-sm font-semibold text-gray-900">Dra. Hilda Mary Díaz García</p>
        <p className="text-xs text-gray-500">Ginecóloga-Obstetra · MPPS: ___________</p>
      </div>
    </div>
  )
}

export default function ConsultaDoc({
  patient,
  appt,
  studies,
}: {
  patient: Patient
  appt: Appointment
  studies: Study[]
}) {
  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          @page { margin: 1.5cm; size: A4; }
          img { max-width: 100%; page-break-inside: avoid; }
        }
      `}</style>

      <div className="min-h-screen bg-slate-900">
        {/* Controls bar */}
        <div className="no-print sticky top-0 z-10 bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center gap-3">
          <Link
            href={`/dashboard/pacientes/${patient.id}`}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={15} />
            {patient.name.split(' ')[0]}
          </Link>
          <span className="text-slate-700">·</span>
          <span className="text-white text-sm font-medium">Resumen de consulta</span>
          <button
            onClick={() => window.print()}
            className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f06292] text-white text-sm font-medium hover:bg-[#e91e8c] transition-colors"
          >
            <Printer size={15} />
            Imprimir / PDF
          </button>
        </div>

        <div className="p-4 md:p-6 max-w-3xl mx-auto">
          <p className="no-print text-slate-500 text-xs mb-2 text-center">Vista previa · se imprime en A4</p>

          <div
            className="bg-white rounded-2xl shadow-2xl p-8 print:rounded-none print:shadow-none print:p-0"
            style={{ fontFamily: 'Georgia, serif', color: '#111' }}
          >
            <Letterhead />

            <h2 className="text-center text-sm font-bold text-gray-800 uppercase tracking-widest mb-6 border-b border-gray-300 pb-2">
              Resumen de Consulta
            </h2>

            {/* Patient + appointment info */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs text-gray-500">Paciente</p>
                <p className="font-semibold text-gray-900 text-base">{patient.name}</p>
                {patient.phone && <p className="text-xs text-gray-500 mt-0.5">{patient.phone}</p>}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Fecha</p>
                <p className="text-sm font-medium text-gray-800">{formatDate(appt.appointment_date)}</p>
                <p className="text-xs text-gray-500 mt-0.5">{formatTime(appt.appointment_time)}</p>
                <p className="text-xs text-gray-500">{getServiceLabel(appt.service_type)}</p>
              </div>
            </div>

            {/* Consultation notes */}
            {appt.notes && (
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pb-1 border-b border-gray-200">
                  Notas de consulta
                </p>
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{appt.notes}</p>
              </div>
            )}

            {/* Studies */}
            {studies.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 pb-1 border-b border-gray-200">
                  Estudios y exámenes ({studies.length})
                </p>
                <div className="space-y-5">
                  {studies.map((study, i) => (
                    <div key={study.id}>
                      <p className="text-sm font-semibold text-gray-900">
                        {i + 1}. {study.name}
                      </p>
                      {study.description && (
                        <p className="text-sm text-gray-600 mt-0.5 ml-4">{study.description}</p>
                      )}
                      {study.file_url && isImage(study.file_name) && (
                        <div className="mt-2 ml-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={study.file_url}
                            alt={study.name}
                            className="max-w-full rounded border border-gray-200"
                            style={{ maxHeight: '320px', objectFit: 'contain' }}
                          />
                        </div>
                      )}
                      {study.file_url && !isImage(study.file_name) && (
                        <p className="text-xs text-gray-500 mt-1 ml-4">
                          📎 {study.file_name || 'Archivo adjunto'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!appt.notes && studies.length === 0 && (
              <p className="text-sm text-gray-400 italic text-center py-8">Sin notas ni estudios registrados</p>
            )}

            <Signature />
          </div>
        </div>
      </div>
    </>
  )
}
