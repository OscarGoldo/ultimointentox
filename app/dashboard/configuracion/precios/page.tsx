import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Settings, Ban } from 'lucide-react'
import PreciosEditor from './PreciosEditor'

export const dynamic = 'force-dynamic'

export default async function PreciosPage() {
  const supabase = await createClient()

  const { data: prices } = await supabase
    .from('service_prices')
    .select('*')
    .order('label', { ascending: true })

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <p className="text-slate-400 text-sm">Configuración</p>
        <h1 className="text-white text-2xl font-bold mt-0.5">Configuración</h1>
      </div>

      {/* Disponibilidad */}
      <Link
        href="/dashboard/configuracion/disponibilidad"
        className="flex items-center gap-3 bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-2xl p-4 mb-4 transition-colors"
      >
        <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
          <Ban size={16} className="text-red-400" />
        </div>
        <div>
          <p className="text-white text-sm font-medium">Días no disponibles</p>
          <p className="text-slate-400 text-xs">Bloquea días por vacaciones o enfermedad</p>
        </div>
        <span className="ml-auto text-slate-600">›</span>
      </Link>

      {/* Precios */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Settings size={15} className="text-slate-400" />
          <h2 className="text-white font-semibold text-sm">Precios de servicios</h2>
        </div>
        {prices && prices.length > 0 ? (
          <PreciosEditor initialPrices={prices} />
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center">
            <Settings size={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">Sin precios configurados</p>
            <p className="text-slate-600 text-sm mt-1">
              Agrega registros a la tabla service_prices en Supabase.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
