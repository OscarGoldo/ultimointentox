'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function DeletePatientButton({ patientId }: { patientId: string }) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    try {
      const res = await fetch(`/api/patients/${patientId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Paciente eliminada')
      router.push('/dashboard/pacientes')
      router.refresh()
    } catch {
      toast.error('No se pudo eliminar la paciente')
      setLoading(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-red-400 text-xs">¿Confirmar borrado?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-2.5 py-1 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {loading ? '...' : 'Sí, borrar'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-2.5 py-1 rounded-lg bg-slate-700 text-slate-300 text-xs hover:bg-slate-600 transition-colors"
        >
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors text-xs"
    >
      <Trash2 size={13} />
      Eliminar paciente
    </button>
  )
}
