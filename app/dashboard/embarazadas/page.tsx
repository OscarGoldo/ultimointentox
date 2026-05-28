import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { addDays, differenceInDays, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowLeft, Baby } from 'lucide-react'
import { getInitials } from '@/lib/utils'

export const dynamic = 'force-dynamic'

function gestationalAge(fumStr: string) {
  const fum = new Date(fumStr + 'T00:00:00')
  const totalDays = Math.max(0, differenceInDays(new Date(), fum))
  return { weeks: Math.floor(totalDays / 7), days: totalDays % 7 }
}

function trimesterLabel(weeks: number) {
  if (weeks <= 12) return '1er trimestre'
  if (weeks <= 27) return '2do trimestre'
  return '3er trimestre'
}

function statusInfo(weeks: number, daysLeft: number) {
  if (weeks >= 40) return { label: 'Término alcanzado', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' }
  if (weeks >= 36) return { label: `${daysLeft}d para parto`, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' }
  return { label: `${daysLeft}d para parto`, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' }
}

export default async function EmbarazadasPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('patients')
    .select('id, name, phone, pregnancy_start_date')
    .eq('is_pregnant', true)
    .not('pregnancy_start_date', 'is', null)

  const patients = (data ?? [])
    .map(p => {
      const fum = p.pregnancy_start_date!
      const fpp = addDays(new Date(fum + 'T00:00:00'), 280)
      const daysLeft = Math.max(0, differenceInDays(fpp, new Date()))
      const { weeks, days } = gestationalAge(fum)
      return { ...p, fum, fpp, daysLeft, weeks, days }
    })
    .sort((a, b) => a.daysLeft - b.daysLeft) // closest to birth first

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <Link
        href="/dashboard/pacientes?filter=embarazo"
        className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-5 transition-colors"
      >
        <ArrowLeft size={15} />
        Pacientes
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <Baby size={22} className="text-pink-400" />
        <div>
          <h1 className="text-white text-2xl font-bold">Tablero de partos</h1>
          <p className="text-slate-400 text-sm">{patients.length} paciente{patients.length !== 1 ? 's' : ''} embarazada{patients.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {patients.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
          <Baby size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No hay pacientes embarazadas con FUM registrada</p>
          <p className="text-slate-600 text-sm mt-1">Ingresa la FUM en el perfil de cada paciente embarazada</p>
        </div>
      ) : (
        <div className="space-y-3">
          {patients.map(p => {
            const { weeks, days, daysLeft, fpp } = p
            const progress = Math.min((weeks / 40) * 100, 100)
            const { label: statusLabel, color: statusColor, bg: statusBg } = statusInfo(weeks, daysLeft)

            return (
              <Link
                key={p.id}
                href={`/dashboard/pacientes/${p.id}`}
                className="block bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-2xl p-4 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full bg-pink-400/20 border border-pink-400/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-pink-400 text-sm font-bold">{getInitials(p.name)}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-white font-semibold truncate">{p.name}</p>
                      <span className={`flex-shrink-0 px-2.5 py-0.5 rounded-full border text-xs font-medium ${statusBg} ${statusColor}`}>
                        {statusLabel}
                      </span>
                    </div>

                    {/* Data row */}
                    <div className="flex gap-4 text-xs text-slate-400 mb-3">
                      <span>Semana <strong className="text-white">{weeks}+{days}</strong></span>
                      <span>·</span>
                      <span>{trimesterLabel(weeks)}</span>
                      <span>·</span>
                      <span>FPP: <strong className="text-white">{format(fpp, 'd MMM yyyy', { locale: es })}</strong></span>
                    </div>

                    {/* Progress bar */}
                    <div className="relative h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="absolute top-0 bottom-0 w-px bg-slate-600" style={{ left: '32.5%' }} />
                      <div className="absolute top-0 bottom-0 w-px bg-slate-600" style={{ left: '70%' }} />
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-[#f06292] rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
