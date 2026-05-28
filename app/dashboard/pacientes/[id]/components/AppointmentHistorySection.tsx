'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, FileText, Paperclip, Plus, Trash2, Save, Loader2 } from 'lucide-react'
import { Appointment, Study } from '@/lib/types'
import { formatDate, formatTime, formatCurrency, getStatusColor, getStatusLabel, getServiceLabel } from '@/lib/utils'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

const TEMPLATES: Record<string, string> = {
  'control-prenatal': `Semanas de gestación:
Peso: kg | TA:  /  mmHg
Altura uterina: cm | LCF: lpm
Movimientos fetales:
Edemas:
Indicaciones:
Próximo control: semana `,

  'ginecologia': `Motivo de consulta:
Antecedentes:
Examen físico:
PAP:
Indicaciones: `,

  'fertilidad': `Ciclo: días | FUR:
Estudios previos:
Tratamiento:
Respuesta:
Próximos pasos: `,

  'planificacion': `Método actual:
Motivo de consulta:
Indicaciones: `,

  'menopausia': `Síntomas:
Última menstruación:
Tratamiento:
Indicaciones: `,

  'otro': `Motivo:
Evaluación:
Indicaciones: `,
}

interface Props {
  patientId: string
  appointments: Appointment[]
}

interface ApptWithData extends Appointment {
  studies?: Study[]
  studiesLoaded?: boolean
}

export default function AppointmentHistorySection({ patientId, appointments: initial }: Props) {
  const [appts, setAppts] = useState<ApptWithData[]>(initial)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [notesMap, setNotesMap] = useState<Record<string, string>>({})
  const [savingNotes, setSavingNotes] = useState<string | null>(null)
  const [addingStudy, setAddingStudy] = useState<string | null>(null)
  const [studyForm, setStudyForm] = useState({ name: '', description: '' })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadingStudy, setUploadingStudy] = useState(false)

  async function toggleExpand(id: string) {
    if (expanded === id) { setExpanded(null); return }
    setExpanded(id)
    const appt = appts.find(a => a.id === id)
    if (!appt?.studiesLoaded) {
      const res = await fetch(`/api/studies?appointment_id=${id}`)
      if (res.ok) {
        const studies = await res.json()
        setAppts(prev => prev.map(a => a.id === id ? { ...a, studies, studiesLoaded: true } : a))
      }
    }
    setNotesMap(prev => ({ ...prev, [id]: prev[id] ?? (appt?.notes || '') }))
  }

  async function saveNotes(id: string) {
    setSavingNotes(id)
    try {
      const res = await fetch(`/api/appointments/${id}/notes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notesMap[id] }),
      })
      if (!res.ok) throw new Error()
      setAppts(prev => prev.map(a => a.id === id ? { ...a, notes: notesMap[id] } : a))
      toast.success('Notas guardadas')
    } catch {
      toast.error('Error al guardar')
    } finally {
      setSavingNotes(null)
    }
  }

  async function submitStudy(apptId: string) {
    if (!studyForm.name.trim()) { toast.error('El nombre es requerido'); return }
    setUploadingStudy(true)
    try {
      let file_url: string | undefined
      let file_name: string | undefined

      if (selectedFile) {
        const supabase = createClient()
        const ext = selectedFile.name.split('.').pop()
        const path = `${patientId}/${apptId}/${Date.now()}.${ext}`
        const { data: up, error: upErr } = await supabase.storage.from('studies').upload(path, selectedFile)
        if (upErr) {
          toast.error(`Error al subir archivo: ${upErr.message}`)
          return
        }
        const { data: urlData } = supabase.storage.from('studies').getPublicUrl(up.path)
        file_url = urlData.publicUrl
        file_name = selectedFile.name
      }

      const res = await fetch('/api/studies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointment_id: apptId, patient_id: patientId, name: studyForm.name, description: studyForm.description || undefined, file_url, file_name }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(`Error al guardar estudio: ${err.error || res.status}`)
        return
      }
      const study = await res.json()
      setAppts(prev => prev.map(a => a.id === apptId ? { ...a, studies: [...(a.studies || []), study] } : a))
      setAddingStudy(null)
      setStudyForm({ name: '', description: '' })
      setSelectedFile(null)
      toast.success('Estudio agregado')
    } catch (e: unknown) {
      toast.error(`Error: ${e instanceof Error ? e.message : 'desconocido'}`)
    } finally {
      setUploadingStudy(false)
    }
  }

  async function deleteStudy(apptId: string, studyId: string) {
    try {
      await fetch(`/api/studies/${studyId}`, { method: 'DELETE' })
      setAppts(prev => prev.map(a => a.id === apptId ? { ...a, studies: (a.studies || []).filter(s => s.id !== studyId) } : a))
      toast.success('Estudio eliminado')
    } catch {
      toast.error('Error al eliminar')
    }
  }

  if (appts.length === 0) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
        <p className="text-slate-400 text-sm">Sin citas registradas</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
      <div className="divide-y divide-slate-700">
        {appts.map((appt) => {
          const isOpen = expanded === appt.id
          const notes = notesMap[appt.id] ?? appt.notes ?? ''
          const notesChanged = notes !== (appt.notes || '')

          return (
            <div key={appt.id}>
              {/* Row header */}
              <button
                className="w-full px-4 py-3 flex items-start justify-between gap-3 hover:bg-slate-700/50 transition-colors text-left"
                onClick={() => toggleExpand(appt.id)}
              >
                <div>
                  <p className="text-white text-sm font-medium">{formatDate(appt.appointment_date)}</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {formatTime(appt.appointment_time)} · {getServiceLabel(appt.service_type)}
                  </p>
                  {appt.revenue != null && (
                    <p className="text-[#f06292] text-xs mt-0.5">{formatCurrency(appt.revenue)}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium border ${getStatusColor(appt.status)}`}>
                    {getStatusLabel(appt.status)}
                  </span>
                  {isOpen ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                </div>
              </button>

              {/* Expanded panel */}
              {isOpen && (
                <div className="px-4 pb-4 pt-3 border-t border-slate-700/50 bg-slate-900/20 space-y-5">

                  {/* Consultation notes */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <FileText size={13} className="text-slate-400" />
                        <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">Notas de consulta</span>
                        {appt.service_type && TEMPLATES[appt.service_type] && (
                          <button
                            onClick={() => setNotesMap(prev => ({ ...prev, [appt.id]: TEMPLATES[appt.service_type!] }))}
                            className="text-slate-600 hover:text-[#f06292] text-xs transition-colors underline underline-offset-2"
                          >
                            usar plantilla
                          </button>
                        )}
                      </div>
                      {notesChanged && (
                        <button
                          onClick={() => saveNotes(appt.id)}
                          disabled={savingNotes === appt.id}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f06292]/20 border border-[#f06292]/40 text-[#f06292] text-xs hover:bg-[#f06292]/30 transition-colors"
                        >
                          {savingNotes === appt.id ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
                          Guardar
                        </button>
                      )}
                    </div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotesMap(prev => ({ ...prev, [appt.id]: e.target.value }))}
                      placeholder="Notas de esta consulta..."
                      rows={notes && notes.includes('\n') ? Math.max(4, notes.split('\n').length + 1) : 3}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-[#f06292] transition-colors text-sm resize-none font-mono"
                    />
                  </div>

                  {/* Studies */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <Paperclip size={13} className="text-slate-400" />
                        <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">Estudios y exámenes</span>
                      </div>
                      {addingStudy !== appt.id && (
                        <button
                          onClick={() => { setAddingStudy(appt.id); setStudyForm({ name: '', description: '' }); setSelectedFile(null) }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-xs transition-colors"
                        >
                          <Plus size={11} /> Agregar
                        </button>
                      )}
                    </div>

                    {!appt.studiesLoaded ? (
                      <p className="text-slate-600 text-xs">Cargando...</p>
                    ) : (
                      <div className="space-y-2">
                        {(appt.studies || []).map(study => (
                          <div key={study.id} className="flex items-start justify-between gap-2 bg-slate-900 rounded-xl p-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium">{study.name}</p>
                              {study.description && <p className="text-slate-400 text-xs mt-0.5">{study.description}</p>}
                              {study.file_url && (
                                <a href={study.file_url} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-[#f06292] text-xs mt-1 hover:underline">
                                  <Paperclip size={11} />{study.file_name || 'Ver archivo'}
                                </a>
                              )}
                            </div>
                            <button onClick={() => deleteStudy(appt.id, study.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                        {(appt.studies || []).length === 0 && addingStudy !== appt.id && (
                          <p className="text-slate-600 text-xs">Sin estudios</p>
                        )}
                      </div>
                    )}

                    {/* New study form */}
                    {addingStudy === appt.id && (
                      <div className="mt-2 bg-slate-900 rounded-xl p-3 space-y-2 border border-slate-700">
                        <input
                          type="text"
                          placeholder="Nombre del estudio *"
                          value={studyForm.name}
                          onChange={(e) => setStudyForm(f => ({ ...f, name: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#f06292] text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Descripción (opcional)"
                          value={studyForm.description}
                          onChange={(e) => setStudyForm(f => ({ ...f, description: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#f06292] text-sm"
                        />
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Archivo adjunto (opcional — imagen, PDF, doc)</p>
                          <input
                            type="file"
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            className="w-full text-slate-400 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-slate-700 file:text-slate-300 hover:file:bg-slate-600 cursor-pointer"
                          />
                          {selectedFile && <p className="text-slate-500 text-xs mt-1">📎 {selectedFile.name}</p>}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => submitStudy(appt.id)}
                            disabled={uploadingStudy}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f06292] text-white text-xs font-medium hover:bg-[#e91e8c] disabled:opacity-50 transition-colors"
                          >
                            {uploadingStudy ? <Loader2 size={11} className="animate-spin" /> : <Plus size={11} />}
                            {uploadingStudy ? 'Subiendo...' : 'Guardar'}
                          </button>
                          <button
                            onClick={() => { setAddingStudy(null); setSelectedFile(null) }}
                            className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-xs hover:text-white transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
