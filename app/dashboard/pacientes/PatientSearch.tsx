'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export default function PatientSearch({ defaultValue }: { defaultValue: string }) {
  const [value, setValue] = useState(defaultValue)
  const router = useRouter()

  const debounce = useCallback(
    (fn: () => void, delay: number) => {
      let timer: ReturnType<typeof setTimeout>
      return () => {
        clearTimeout(timer)
        timer = setTimeout(fn, delay)
      }
    },
    []
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setValue(v)
    debounce(() => {
      const params = new URLSearchParams()
      if (v) params.set('q', v)
      router.push(`/dashboard/pacientes?${params.toString()}`)
    }, 400)()
  }

  return (
    <div className="relative mb-4">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Buscar por nombre, correo o teléfono..."
        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#f06292] transition-colors text-sm"
      />
    </div>
  )
}
