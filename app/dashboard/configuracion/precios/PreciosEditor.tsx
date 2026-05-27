'use client'

import { useState } from 'react'
import { ServicePrice } from '@/lib/types'
import { Save, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface Props {
  initialPrices: ServicePrice[]
}

export default function PreciosEditor({ initialPrices }: Props) {
  const [prices, setPrices] = useState<ServicePrice[]>(initialPrices)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  function handleChange(id: string, value: string) {
    setPrices((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: parseFloat(value) || 0 } : p))
    )
    setDirty(true)
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()

    try {
      for (const price of prices) {
        const { error } = await supabase
          .from('service_prices')
          .update({ price: price.price, updated_at: new Date().toISOString() })
          .eq('id', price.id)

        if (error) throw error
      }
      toast.success('Precios actualizados correctamente')
      setDirty(false)
    } catch {
      toast.error('Error al guardar los precios')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="divide-y divide-slate-700">
          {prices.map((price) => (
            <div key={price.id} className="flex items-center gap-4 px-4 py-3.5">
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{price.label}</p>
                <p className="text-slate-500 text-xs">{price.service_type}</p>
              </div>
              <div className="relative w-28">
                <DollarSign
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="number"
                  value={price.price}
                  onChange={(e) => handleChange(price.id, e.target.value)}
                  min="0"
                  step="1"
                  className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-right focus:outline-none focus:border-[#f06292] transition-colors text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={!dirty || saving}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#f06292] hover:bg-[#e91e8c] disabled:bg-[#f06292]/40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
      >
        <Save size={16} />
        {saving ? 'Guardando...' : 'Guardar cambios'}
      </button>

      {!dirty && (
        <p className="text-center text-slate-600 text-xs">
          Modifica los valores para habilitar el botón de guardar.
        </p>
      )}
    </div>
  )
}
