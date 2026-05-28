'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowLeft, Printer, Plus, Trash2 } from 'lucide-react'
import { Patient } from '@/lib/types'

type DocType = 'recipe' | 'constancia' | 'orden' | 'referencia' | 'certificado'

const DOC_LABELS: Record<DocType, string> = {
  recipe: 'Récipe Médico',
  constancia: 'Constancia de Consulta',
  orden: 'Orden de Estudios',
  referencia: 'Referencia Médica',
  certificado: 'Certificado Médico',
}

interface Medication { name: string; dose: string; frequency: string; duration: string }

function todayStr() {
  return format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es })
}

// ── Letterhead ──────────────────────────────────────────────────────────────
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

// ── Document templates ───────────────────────────────────────────────────────
function RecipeDoc({ patient, f }: { patient: Patient; f: FormData }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-500">Paciente</p>
          <p className="font-semibold text-gray-900">{patient.name}</p>
          {patient.phone && <p className="text-xs text-gray-500">{patient.phone}</p>}
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Fecha</p>
          <p className="text-sm text-gray-700">{f.date || todayStr()}</p>
        </div>
      </div>

      {f.diagnosis && (
        <div className="bg-gray-50 border border-gray-200 rounded p-2">
          <p className="text-xs text-gray-500 mb-0.5">Diagnóstico</p>
          <p className="text-sm text-gray-800">{f.diagnosis}</p>
        </div>
      )}

      <div>
        <p className="text-2xl font-bold text-gray-800 mb-3">℞</p>
        {f.medications.length === 0 ? (
          <p className="text-gray-400 text-sm italic">Sin medicamentos</p>
        ) : (
          <ol className="space-y-3">
            {f.medications.map((m, i) => (
              <li key={i} className="border-l-2 border-gray-300 pl-3">
                <p className="font-semibold text-gray-900 text-sm">{i + 1}. {m.name || '___'}</p>
                <p className="text-sm text-gray-600">
                  {[m.dose, m.frequency, m.duration].filter(Boolean).join(' · ')}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>

      {f.instructions && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Indicaciones</p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{f.instructions}</p>
        </div>
      )}
    </div>
  )
}

function ConstanciaDoc({ patient, f }: { patient: Patient; f: FormData }) {
  return (
    <div className="space-y-4 text-sm text-gray-800 leading-relaxed">
      <div className="text-right">
        <p>Maturín, {f.date || todayStr()}</p>
      </div>
      <p>
        Por medio de la presente, yo <strong>Dra. Hilda Mary Díaz García</strong>, Médico
        Especialista en Ginecología y Obstetricia, hago constar que la ciudadana{' '}
        <strong>{patient.name}</strong>{patient.phone ? `, titular del teléfono ${patient.phone},` : ','}{' '}
        acudió a consulta médica en esta fecha.
      </p>
      {f.motivo && (
        <p>
          <strong>Motivo de consulta / Diagnóstico:</strong> {f.motivo}.
        </p>
      )}
      {f.notes && <p className="whitespace-pre-wrap">{f.notes}</p>}
      <p>
        Constancia que se expide a petición de la parte interesada, a los{' '}
        {format(new Date(), "d 'días del mes de' MMMM 'del año' yyyy", { locale: es })}.
      </p>
    </div>
  )
}

function OrdenDoc({ patient, f }: { patient: Patient; f: FormData }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div>
          <p className="text-xs text-gray-500">Paciente</p>
          <p className="font-semibold text-gray-900">{patient.name}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Fecha</p>
          <p className="text-sm text-gray-700">{f.date || todayStr()}</p>
        </div>
      </div>

      {f.indication && (
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Indicación clínica</p>
          <p className="text-sm text-gray-800">{f.indication}</p>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Solicito la realización de los siguientes estudios:
        </p>
        {f.studies.filter(s => s.trim()).length === 0 ? (
          <p className="text-gray-400 text-sm italic">Sin estudios indicados</p>
        ) : (
          <ul className="space-y-1.5">
            {f.studies.filter(s => s.trim()).map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-800">
                <span className="w-4 h-4 border border-gray-400 rounded-sm flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function ReferenciaDoc({ patient, f }: { patient: Patient; f: FormData }) {
  return (
    <div className="space-y-4 text-sm text-gray-800">
      <div className="text-right text-gray-600">
        <p>Maturín, {f.date || todayStr()}</p>
      </div>
      <div>
        <p>Estimado(a) <strong>{f.referredTo ? `Dr(a). ${f.referredTo}` : 'colega'}</strong></p>
        {f.referredSpecialty && <p className="text-gray-500">{f.referredSpecialty}</p>}
      </div>
      <p>
        Por medio de la presente, le remito a la paciente{' '}
        <strong>{patient.name}</strong>
        {f.diagnosis ? `, quien presenta ${f.diagnosis}.` : '.'}
      </p>
      {f.historyNotes && (
        <div>
          <p className="font-semibold text-gray-700 mb-1">Antecedentes relevantes:</p>
          <p className="whitespace-pre-wrap">{f.historyNotes}</p>
        </div>
      )}
      {f.referralReason && (
        <div>
          <p className="font-semibold text-gray-700 mb-1">Motivo de referencia:</p>
          <p className="whitespace-pre-wrap">{f.referralReason}</p>
        </div>
      )}
      <p>Agradezco su atención a la paciente y quedo en espera de su valoración.</p>
      <p>Atentamente,</p>
    </div>
  )
}

function CertificadoDoc({ patient, f }: { patient: Patient; f: FormData }) {
  const purposeText = f.purpose === 'reposo'
    ? `se encuentra bajo reposo médico por un período de ${f.daysRest || '__'} día(s), a partir de la presente fecha`
    : f.purpose === 'aptitud'
    ? 'se encuentra apta para realizar sus actividades laborales habituales'
    : f.customPurpose || '___'

  return (
    <div className="space-y-4 text-sm text-gray-800 leading-relaxed">
      <div className="text-right text-gray-600">
        <p>Maturín, {f.date || todayStr()}</p>
      </div>
      <p>
        Yo, <strong>Dra. Hilda Mary Díaz García</strong>, Médico Especialista en Ginecología y
        Obstetricia, MPPS: ___________, por medio del presente certifico que la ciudadana{' '}
        <strong>{patient.name}</strong> {purposeText}.
      </p>
      {f.observations && <p className="whitespace-pre-wrap">{f.observations}</p>}
      <p>
        Certificado que se expide a petición de la parte interesada, a los{' '}
        {format(new Date(), "d 'días del mes de' MMMM 'del año' yyyy", { locale: es })}.
      </p>
    </div>
  )
}

// ── Form data type ──────────────────────────────────────────────────────────
interface FormData {
  date: string
  // Recipe
  medications: Medication[]
  diagnosis: string
  instructions: string
  // Constancia
  motivo: string
  notes: string
  // Orden
  studies: string[]
  indication: string
  // Referencia
  referredTo: string
  referredSpecialty: string
  historyNotes: string
  referralReason: string
  // Certificado
  purpose: 'reposo' | 'aptitud' | 'otro'
  daysRest: string
  customPurpose: string
  observations: string
}

function initialForm(tipo: DocType, lastAppt: { notes?: string | null } | null): FormData {
  const base: FormData = {
    date: todayStr(),
    medications: [{ name: '', dose: '', frequency: '', duration: '' }],
    diagnosis: '',
    instructions: '',
    motivo: '',
    notes: '',
    studies: [''],
    indication: '',
    referredTo: '',
    referredSpecialty: '',
    historyNotes: lastAppt?.notes || '',
    referralReason: '',
    purpose: 'reposo',
    daysRest: '3',
    customPurpose: '',
    observations: '',
  }
  return base
}

// ── Forms ────────────────────────────────────────────────────────────────────
const inputCls = 'w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-[#f06292] text-sm'
const labelCls = 'block text-slate-400 text-xs mb-1'
const sectionCls = 'space-y-3'

function RecipeForm({ f, set }: { f: FormData; set: (f: FormData) => void }) {
  function addMed() { set({ ...f, medications: [...f.medications, { name: '', dose: '', frequency: '', duration: '' }] }) }
  function removeMed(i: number) { set({ ...f, medications: f.medications.filter((_, j) => j !== i) }) }
  function updateMed(i: number, field: keyof Medication, val: string) {
    const meds = f.medications.map((m, j) => j === i ? { ...m, [field]: val } : m)
    set({ ...f, medications: meds })
  }

  return (
    <div className={sectionCls}>
      <div>
        <label className={labelCls}>Diagnóstico (opcional)</label>
        <input type="text" className={inputCls} placeholder="Ej: Infección urinaria" value={f.diagnosis} onChange={e => set({ ...f, diagnosis: e.target.value })} />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelCls}>Medicamentos</label>
          <button onClick={addMed} className="flex items-center gap-1 text-[#f06292] text-xs hover:underline">
            <Plus size={11} /> Agregar
          </button>
        </div>
        <div className="space-y-3">
          {f.medications.map((m, i) => (
            <div key={i} className="bg-slate-900/60 rounded-xl p-3 space-y-2 border border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs">Medicamento {i + 1}</span>
                {f.medications.length > 1 && (
                  <button onClick={() => removeMed(i)} className="text-slate-600 hover:text-red-400">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
              <input type="text" className={inputCls} placeholder="Nombre del medicamento" value={m.name} onChange={e => updateMed(i, 'name', e.target.value)} />
              <div className="grid grid-cols-3 gap-2">
                <input type="text" className={inputCls} placeholder="Dosis" value={m.dose} onChange={e => updateMed(i, 'dose', e.target.value)} />
                <input type="text" className={inputCls} placeholder="Frecuencia" value={m.frequency} onChange={e => updateMed(i, 'frequency', e.target.value)} />
                <input type="text" className={inputCls} placeholder="Duración" value={m.duration} onChange={e => updateMed(i, 'duration', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label className={labelCls}>Indicaciones generales</label>
        <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Reposo, dieta, observaciones..." value={f.instructions} onChange={e => set({ ...f, instructions: e.target.value })} />
      </div>
    </div>
  )
}

function ConstanciaForm({ f, set }: { f: FormData; set: (f: FormData) => void }) {
  return (
    <div className={sectionCls}>
      <div>
        <label className={labelCls}>Motivo / Diagnóstico</label>
        <input type="text" className={inputCls} placeholder="Ej: Control ginecológico de rutina" value={f.motivo} onChange={e => set({ ...f, motivo: e.target.value })} />
      </div>
      <div>
        <label className={labelCls}>Observaciones adicionales</label>
        <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Observaciones adicionales..." value={f.notes} onChange={e => set({ ...f, notes: e.target.value })} />
      </div>
    </div>
  )
}

function OrdenForm({ f, set }: { f: FormData; set: (f: FormData) => void }) {
  function addStudy() { set({ ...f, studies: [...f.studies, ''] }) }
  function removeStudy(i: number) { set({ ...f, studies: f.studies.filter((_, j) => j !== i) }) }
  function updateStudy(i: number, val: string) { set({ ...f, studies: f.studies.map((s, j) => j === i ? val : s) }) }

  return (
    <div className={sectionCls}>
      <div>
        <label className={labelCls}>Indicación clínica</label>
        <input type="text" className={inputCls} placeholder="Ej: Control prenatal semana 20" value={f.indication} onChange={e => set({ ...f, indication: e.target.value })} />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelCls}>Estudios solicitados</label>
          <button onClick={addStudy} className="flex items-center gap-1 text-[#f06292] text-xs hover:underline">
            <Plus size={11} /> Agregar
          </button>
        </div>
        <div className="space-y-2">
          {f.studies.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="text" className={inputCls} placeholder="Ej: Ecosonograma obstétrico" value={s} onChange={e => updateStudy(i, e.target.value)} />
              {f.studies.length > 1 && (
                <button onClick={() => removeStudy(i)} className="text-slate-600 hover:text-red-400 flex-shrink-0">
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ReferenciaForm({ f, set }: { f: FormData; set: (f: FormData) => void }) {
  return (
    <div className={sectionCls}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Médico referido</label>
          <input type="text" className={inputCls} placeholder="Nombre del médico" value={f.referredTo} onChange={e => set({ ...f, referredTo: e.target.value })} />
        </div>
        <div>
          <label className={labelCls}>Especialidad</label>
          <input type="text" className={inputCls} placeholder="Ej: Cardiología" value={f.referredSpecialty} onChange={e => set({ ...f, referredSpecialty: e.target.value })} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Diagnóstico / Motivo</label>
        <input type="text" className={inputCls} placeholder="Ej: HTA gestacional" value={f.diagnosis} onChange={e => set({ ...f, diagnosis: e.target.value })} />
      </div>
      <div>
        <label className={labelCls}>Antecedentes relevantes</label>
        <textarea className={`${inputCls} resize-none`} rows={3} value={f.historyNotes} onChange={e => set({ ...f, historyNotes: e.target.value })} />
      </div>
      <div>
        <label className={labelCls}>Motivo de referencia</label>
        <textarea className={`${inputCls} resize-none`} rows={2} placeholder="Solicito su valoración y manejo..." value={f.referralReason} onChange={e => set({ ...f, referralReason: e.target.value })} />
      </div>
    </div>
  )
}

function CertificadoForm({ f, set }: { f: FormData; set: (f: FormData) => void }) {
  return (
    <div className={sectionCls}>
      <div>
        <label className={labelCls}>Tipo de certificado</label>
        <select className={inputCls} value={f.purpose} onChange={e => set({ ...f, purpose: e.target.value as FormData['purpose'] })}>
          <option value="reposo">Reposo médico</option>
          <option value="aptitud">Aptitud laboral</option>
          <option value="otro">Otro</option>
        </select>
      </div>
      {f.purpose === 'reposo' && (
        <div>
          <label className={labelCls}>Días de reposo</label>
          <input type="number" min="1" className={inputCls} value={f.daysRest} onChange={e => set({ ...f, daysRest: e.target.value })} />
        </div>
      )}
      {f.purpose === 'otro' && (
        <div>
          <label className={labelCls}>Descripción</label>
          <input type="text" className={inputCls} placeholder="Texto del certificado..." value={f.customPurpose} onChange={e => set({ ...f, customPurpose: e.target.value })} />
        </div>
      )}
      <div>
        <label className={labelCls}>Observaciones</label>
        <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Observaciones adicionales..." value={f.observations} onChange={e => set({ ...f, observations: e.target.value })} />
      </div>
    </div>
  )
}

// ── Main editor ──────────────────────────────────────────────────────────────
export default function DocumentEditor({
  patient,
  tipo,
  lastAppt,
}: {
  patient: Patient
  tipo: string
  lastAppt: { notes?: string | null } | null
}) {
  const docType = tipo as DocType
  const [form, setForm] = useState<FormData>(() => initialForm(docType, lastAppt))

  const docLabel = DOC_LABELS[docType]

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          @page { margin: 1.5cm; size: A4; }
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
          <span className="text-white text-sm font-medium">{docLabel}</span>
          <button
            onClick={() => window.print()}
            className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f06292] text-white text-sm font-medium hover:bg-[#e91e8c] transition-colors"
          >
            <Printer size={15} />
            Imprimir / PDF
          </button>
        </div>

        <div className="p-4 md:p-6 max-w-5xl mx-auto md:grid md:grid-cols-2 md:gap-6">
          {/* Form panel */}
          <div className="no-print mb-6 md:mb-0">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
              <h2 className="text-white font-semibold text-sm mb-4">Datos del documento</h2>
              {docType === 'recipe' && <RecipeForm f={form} set={setForm} />}
              {docType === 'constancia' && <ConstanciaForm f={form} set={setForm} />}
              {docType === 'orden' && <OrdenForm f={form} set={setForm} />}
              {docType === 'referencia' && <ReferenciaForm f={form} set={setForm} />}
              {docType === 'certificado' && <CertificadoForm f={form} set={setForm} />}
            </div>
          </div>

          {/* Document preview */}
          <div>
            <p className="no-print text-slate-500 text-xs mb-2 text-center">Vista previa · se imprime en A4</p>
            <div
              id="documento"
              className="bg-white rounded-2xl shadow-2xl p-8 print:rounded-none print:shadow-none print:p-0"
              style={{ fontFamily: 'Georgia, serif', color: '#111' }}
            >
              <Letterhead />

              <h2 className="text-center text-sm font-bold text-gray-800 uppercase tracking-widest mb-5 border-b border-gray-300 pb-2">
                {docLabel}
              </h2>

              {docType === 'recipe' && <RecipeDoc patient={patient} f={form} />}
              {docType === 'constancia' && <ConstanciaDoc patient={patient} f={form} />}
              {docType === 'orden' && <OrdenDoc patient={patient} f={form} />}
              {docType === 'referencia' && <ReferenciaDoc patient={patient} f={form} />}
              {docType === 'certificado' && <CertificadoDoc patient={patient} f={form} />}

              <Signature />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
