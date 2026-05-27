import { createClient } from '@/lib/supabase/server'
import { Settings } from 'lucide-react'
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
      {/* Header */}
      <div className="mb-6">
        <p className="text-slate-400 text-sm">Configuración</p>
        <h1 className="text-white text-2xl font-bold mt-0.5">Precios de servicios</h1>
        <p className="text-slate-500 text-sm mt-1">
          Actualiza los precios base para cada tipo de consulta.
        </p>
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
  )
}
