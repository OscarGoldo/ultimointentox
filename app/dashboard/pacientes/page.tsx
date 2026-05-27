import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Users, AlertTriangle, UserMinus, UserCheck } from 'lucide-react'
import { formatDateShort, buildWhatsAppUrl, getInitials } from '@/lib/utils'
import { Patient } from '@/lib/types'
import PatientSearch from './PatientSearch'

export const dynamic = 'force-dynamic'

const SIX_MONTHS_AGO = new Date()
SIX_MONTHS_AGO.setMonth(SIX_MONTHS_AGO.getMonth() - 6)

const FOURTEEN_MONTHS_AGO = new Date()
FOURTEEN_MONTHS_AGO.setMonth(FOURTEEN_MONTHS_AGO.getMonth() - 14)

interface SearchParams {
  q?: string
  filter?: string
  page?: string
}

export default async function PacientesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const query = params.q || ''
  const filter = params.filter || 'todas'
  const page = parseInt(params.page || '1')
  const pageSize = 20

  const supabase = await createClient()

  // Get counts for segmentation
  const { count: totalCount } = await supabase
    .from('patients')
    .select('*', { count: 'exact', head: true })

  const { count: activeCount } = await supabase
    .from('patients')
    .select('*', { count: 'exact', head: true })
    .gte('last_visit_date', SIX_MONTHS_AGO.toISOString().split('T')[0])

  const { count: atRiskCount } = await supabase
    .from('at_risk_patients')
    .select('*', { count: 'exact', head: true })

  const { count: inactiveCount } = await supabase
    .from('patients')
    .select('*', { count: 'exact', head: true })
    .lt('last_visit_date', FOURTEEN_MONTHS_AGO.toISOString().split('T')[0])

  // Build patient query based on filter
  let patientQuery = supabase
    .from('patients')
    .select('*')
    .order('last_visit_date', { ascending: false, nullsFirst: false })

  if (query) {
    patientQuery = patientQuery.or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
  }

  if (filter === 'activas') {
    patientQuery = patientQuery.gte('last_visit_date', SIX_MONTHS_AGO.toISOString().split('T')[0])
  } else if (filter === 'en-riesgo') {
    patientQuery = patientQuery
      .lt('last_visit_date', SIX_MONTHS_AGO.toISOString().split('T')[0])
      .gte('last_visit_date', FOURTEEN_MONTHS_AGO.toISOString().split('T')[0])
  } else if (filter === 'inactivas') {
    patientQuery = patientQuery.lt('last_visit_date', FOURTEEN_MONTHS_AGO.toISOString().split('T')[0])
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data: patients } = await patientQuery.range(from, to)

  // At-risk patients for the alert section
  const { data: atRiskPatients } = await supabase
    .from('at_risk_patients')
    .select('*')
    .limit(5)

  const patientList: Patient[] = patients || []
  const atRisk: Patient[] = atRiskPatients || []

  const filterTabs = [
    { key: 'todas', label: 'Todas', count: totalCount || 0 },
    { key: 'activas', label: 'Activas', count: activeCount || 0 },
    { key: 'en-riesgo', label: 'En riesgo', count: atRiskCount || 0 },
    { key: 'inactivas', label: 'Inactivas', count: inactiveCount || 0 },
  ]

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-slate-400 text-sm">Gestión de pacientes</p>
        <h1 className="text-white text-2xl font-bold mt-0.5">Pacientes</h1>
      </div>

      {/* Segmentation Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <SegCard
          label="Total"
          count={totalCount || 0}
          icon={<Users size={18} className="text-[#f06292]" />}
          color="text-white"
        />
        <SegCard
          label="Activas"
          count={activeCount || 0}
          icon={<UserCheck size={18} className="text-emerald-400" />}
          color="text-emerald-400"
        />
        <SegCard
          label="En riesgo"
          count={atRiskCount || 0}
          icon={<AlertTriangle size={18} className="text-orange-400" />}
          color="text-orange-400"
        />
        <SegCard
          label="Inactivas"
          count={inactiveCount || 0}
          icon={<UserMinus size={18} className="text-slate-400" />}
          color="text-slate-400"
        />
      </div>

      {/* At-risk patients alert */}
      {atRisk.length > 0 && filter !== 'en-riesgo' && !query && (
        <div className="bg-orange-400/10 border border-orange-400/30 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-orange-400" />
            <h2 className="text-orange-400 font-semibold text-sm">Pacientes en riesgo de pérdida</h2>
          </div>
          <div className="space-y-2">
            {atRisk.map((p) => {
              const waMsg = `Hola ${p.name.split(' ')[0]}, le escribimos del consultorio de la Dra. Hilda Díaz García. Notamos que hace tiempo no tiene una cita. ¿Le gustaría programar una consulta?`
              const waUrl = p.phone ? buildWhatsAppUrl(p.phone, waMsg) : null
              return (
                <div key={p.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-orange-400/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-400 text-xs font-bold">{getInitials(p.name)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{p.name}</p>
                      <p className="text-slate-400 text-xs">
                        Última visita: {p.last_visit_date ? formatDateShort(p.last_visit_date) : 'Nunca'}
                      </p>
                    </div>
                  </div>
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30 transition-colors"
                    >
                      WhatsApp
                    </a>
                  )}
                </div>
              )
            })}
          </div>
          {(atRiskCount || 0) > 5 && (
            <Link href="/dashboard/pacientes?filter=en-riesgo" className="block text-center text-orange-400 text-xs mt-3 hover:underline">
              Ver todas las {atRiskCount} pacientes en riesgo →
            </Link>
          )}
        </div>
      )}

      {/* Search (client component) */}
      <PatientSearch defaultValue={query} />

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {filterTabs.map((tab) => (
          <a
            key={tab.key}
            href={`/dashboard/pacientes?filter=${tab.key}${query ? `&q=${query}` : ''}`}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              filter === tab.key
                ? 'bg-[#f06292]/20 border-[#f06292]/40 text-[#f06292]'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label} ({tab.count})
          </a>
        ))}
      </div>

      {/* Patient list */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        {patientList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Users size={40} className="text-slate-600 mb-3" />
            <p className="text-slate-400 font-medium">No se encontraron pacientes</p>
            {query && <p className="text-slate-600 text-sm mt-1">Intenta con otro término</p>}
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {patientList.map((patient) => (
              <a
                key={patient.id}
                href={`/dashboard/pacientes/${patient.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[#f06292]/20 border border-[#f06292]/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#f06292] text-xs font-bold">{getInitials(patient.name)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{patient.name}</p>
                  <p className="text-slate-400 text-xs">
                    {patient.total_visits} visitas · Última: {patient.last_visit_date ? formatDateShort(patient.last_visit_date) : 'Nunca'}
                  </p>
                </div>
                <span className="text-slate-600 text-xs flex-shrink-0">›</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {patientList.length === pageSize && (
        <div className="flex justify-center mt-4">
          <a
            href={`/dashboard/pacientes?filter=${filter}&page=${page + 1}${query ? `&q=${query}` : ''}`}
            className="px-6 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors text-sm"
          >
            Cargar más →
          </a>
        </div>
      )}
    </div>
  )
}

function SegCard({ label, count, icon, color }: {
  label: string
  count: number
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-slate-400 text-xs">{label}</p>
        {icon}
      </div>
      <p className={`text-2xl font-bold ${color}`}>{count}</p>
    </div>
  )
}
