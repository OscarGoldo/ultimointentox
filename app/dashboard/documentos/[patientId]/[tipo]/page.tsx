import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import DocumentEditor from './DocumentEditor'

export const dynamic = 'force-dynamic'

const VALID = ['recipe', 'constancia', 'orden', 'referencia', 'certificado']

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ patientId: string; tipo: string }>
}) {
  const { patientId, tipo } = await params
  if (!VALID.includes(tipo)) notFound()

  const supabase = await createClient()

  const [{ data: patient }, { data: lastAppt }] = await Promise.all([
    supabase.from('patients').select('*').eq('id', patientId).single(),
    supabase
      .from('appointments')
      .select('appointment_date, service_type, notes')
      .eq('patient_id', patientId)
      .order('appointment_date', { ascending: false })
      .limit(1)
      .single(),
  ])

  if (!patient) notFound()

  return <DocumentEditor patient={patient} tipo={tipo} lastAppt={lastAppt ?? null} />
}
