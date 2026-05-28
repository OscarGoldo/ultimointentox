import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { SERVICE_LABELS } from '@/lib/utils'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const [{ data: patient }, { data: appointments }, { data: studies }] = await Promise.all([
      supabase.from('patients').select('*').eq('id', id).single(),
      supabase.from('appointments').select('*').eq('patient_id', id).order('appointment_date', { ascending: false }),
      supabase.from('studies').select('*').eq('patient_id', id).order('created_at', { ascending: false }),
    ])

    if (!patient) return NextResponse.json({ error: 'Paciente no encontrada' }, { status: 404 })

    const appts = appointments || []
    const studiesList = studies || []

    const context = `
Paciente: ${patient.name}
Primera visita: ${patient.first_visit_date || 'N/A'}
Última visita: ${patient.last_visit_date || 'N/A'}
Total visitas: ${patient.total_visits}
Embarazada: ${patient.is_pregnant ? 'Sí' : 'No'}${patient.pregnancy_start_date ? ` (desde ${patient.pregnancy_start_date})` : ''}
Notas generales: ${patient.notes || 'Ninguna'}

Historial de citas (${appts.length} en total):
${appts.slice(0, 15).map(a =>
  `- ${a.appointment_date}: ${SERVICE_LABELS[a.service_type ?? ''] || a.service_type || 'Sin especificar'} — ${a.status}${a.notes ? ` | Notas: ${a.notes}` : ''}`
).join('\n')}

Estudios registrados (${studiesList.length}):
${studiesList.slice(0, 10).map(s => `- ${s.name}${s.description ? `: ${s.description}` : ''}`).join('\n')}
`.trim()

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 700,
      messages: [{
        role: 'user',
        content: `Eres asistente clínico de la Dra. Hilda Díaz García, ginecóloga-obstetra en Venezuela. Analiza el perfil de esta paciente y genera 3-4 observaciones clínicas concretas y útiles para la doctora. Sé específica y práctica. Responde SOLO con un array JSON de strings, sin texto adicional.\n\n${context}`,
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    let insights: string[] = []
    try {
      const match = text.match(/\[[\s\S]*\]/)
      if (match) insights = JSON.parse(match[0])
    } catch {
      insights = [text]
    }

    return NextResponse.json({ insights })
  } catch {
    return NextResponse.json({ error: 'Error generating insights' }, { status: 500 })
  }
}
