'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, X, Save, Loader2 } from 'lucide-react'
import { Patient } from '@/lib/types'
import { toast } from 'sonner'

export default function EditPatientModal({ patient }: { patient: Patient }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: patient.name,
    cedula: patient.cedula || '',
    phone: patient.phone || '',
    email: patient.email || '',
    notes: patient.notes || '',
  })
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  function openModal() {
    setForm({
      name: patient.name,
      cedula: patient.cedula || '',
      phone: patient.phone || '',
      email: patient.email || '',
      notes: patient.notes || '',
    })
    setOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim()) { toast.error('El nombre es requerido'); return }
    setSaving(true)
    try {
      const res = await fetch(`/api/patients/${patient.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          cedula: form.cedula.trim() || null,
          phone: form.phone.trim() || null,
          email: form.email.trim() || null,
          notes: form.notes.trim() || null,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Datos actualizados')
      setOpen(false)
      router.refresh()
    } catch {
      toast.error('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <button
        onClick={openModal}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors text-xs"
      >
        <Pencil size={12} />
        Editar datos
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => !saving && setOpen(false)}
          />

          {/* Modal — slides up on mobile, centered on desktop */}
          <div className="fixed inset-x-0 bottom-0 z-50 bg-slate-900 border-t border-slate-700 rounded-t-2xl md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md md:rounded-2xl md:border md:border-slate-700">
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-800">
              <h2 className="text-white font-semibold text-sm">Editar datos del paciente</h2>
              <button
                onClick={() => setOpen(false)}
                disabled={saving}
                className="text-slate-400 hover:text-white p-1 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="block text-slate-400 text-xs mb-1">Nombre completo *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-[#f06292] text-sm transition-colors"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1">Cédula de identidad</label>
                <input
                  type="text"
                  value={form.cedula}
                  onChange={e => setForm(f => ({ ...f, cedula: e.target.value }))}
                  placeholder="Ej: V-12345678"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-[#f06292] text-sm transition-colors"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="Ej: 584121234567"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-[#f06292] text-sm transition-colors"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1">Correo electrónico</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-[#f06292] text-sm transition-colors"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1">Notas internas</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Alergias, antecedentes, observaciones..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-[#f06292] text-sm resize-none transition-colors"
                />
              </div>
            </div>

            <div className="px-5 pb-8 md:pb-5 flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#f06292] text-white text-sm font-medium hover:bg-[#e91e8c] disabled:opacity-50 transition-colors"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button
                onClick={() => setOpen(false)}
                disabled={saving}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm hover:text-white transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
