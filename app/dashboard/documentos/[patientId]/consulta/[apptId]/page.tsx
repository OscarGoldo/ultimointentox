import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ConsultaDoc from './ConsultaDoc'

export const dynamic = 'force-dynamic'

export default async function ConsultaDocPage({
  params,
}: {
  params: Promise<{ patientId: string; apptId: string }>
}) {
  const { patientId, apptId } = await params
  const supabase = await createClient()

  const [{ data: patient }, { data: appt }, { data: studies }] = await Promise.all([
    supabase.from('patients').select('*').eq('id', patientId).single(),
    supabase.from('appointments').select('*').eq('id', apptId).single(),
    supabase.from('studies').select('*').eq('appointment_id', apptId).order('created_at'),
  ])

  if (!patient || !appt) notFound()

  return <ConsultaDoc patient={patient} appt={appt} studies={studies || []} />
}
