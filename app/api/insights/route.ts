import { NextRequest, NextResponse } from 'next/server'

interface StatsInput {
  totalAppointments: number
  revenue: number
  newPatients: number
  attendanceRate: number
  topService: string
  monthlyData: { label: string; citas: number }[]
}

export async function POST(request: NextRequest) {
  try {
    const stats: StatsInput = await request.json()

    // Check if Anthropic API key is available
    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      // Return static placeholder insights based on the data
      const insights = generateStaticInsights(stats)
      return NextResponse.json({ insights })
    }

    // Call Claude API
    const prompt = buildPrompt(stats)

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-20240307',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const insights = generateStaticInsights(stats)
      return NextResponse.json({ insights })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ''

    // Parse the numbered list from Claude's response
    const lines = text
      .split('\n')
      .map((l: string) => l.replace(/^\d+\.\s*/, '').trim())
      .filter((l: string) => l.length > 20)
      .slice(0, 3)

    const insights = lines.length >= 1 ? lines : generateStaticInsights(stats)

    return NextResponse.json({ insights })
  } catch {
    return NextResponse.json({ insights: [] }, { status: 500 })
  }
}

function buildPrompt(stats: StatsInput): string {
  const trend =
    stats.monthlyData.length >= 2
      ? stats.monthlyData[stats.monthlyData.length - 1].citas >
        stats.monthlyData[stats.monthlyData.length - 2].citas
        ? 'creciente'
        : 'decreciente'
      : 'estable'

  return `Eres un asistente de gestión para el consultorio de la Dra. Hilda Díaz García, ginecóloga.

Datos del año:
- Total citas: ${stats.totalAppointments}
- Ingresos: $${stats.revenue.toFixed(2)}
- Pacientes nuevas: ${stats.newPatients}
- Tasa de asistencia: ${stats.attendanceRate}%
- Servicio más solicitado: ${stats.topService}
- Tendencia de citas: ${trend}

Genera exactamente 3 insights accionables y concretos (1-2 oraciones cada uno) en español, numerados del 1 al 3. Sin introducción, solo los 3 puntos.`
}

function generateStaticInsights(stats: StatsInput): string[] {
  const insights: string[] = []

  // Attendance rate insight
  if (stats.attendanceRate < 70) {
    insights.push(
      `Tu tasa de asistencia es del ${stats.attendanceRate}%. Considera implementar recordatorios por WhatsApp 24 horas antes de cada cita para reducir las inasistencias.`
    )
  } else {
    insights.push(
      `Excelente tasa de asistencia del ${stats.attendanceRate}%. Los recordatorios y confirmaciones están funcionando bien para tu práctica.`
    )
  }

  // New patients insight
  const newPatientRate =
    stats.totalAppointments > 0
      ? Math.round((stats.newPatients / stats.totalAppointments) * 100)
      : 0
  insights.push(
    `El ${newPatientRate}% de tus citas son pacientes nuevas. ${
      newPatientRate > 30
        ? 'Tu captación es sólida; enfoca esfuerzos en retención y seguimiento a largo plazo.'
        : 'Considera estrategias de marketing en Instagram para aumentar la captación de nuevas pacientes.'
    }`
  )

  // Revenue insight
  const avgPerAppt =
    stats.totalAppointments > 0 ? stats.revenue / stats.totalAppointments : 0
  if (avgPerAppt > 0) {
    insights.push(
      `El ingreso promedio por consulta es de $${avgPerAppt.toFixed(2)}. Revisar los precios de servicios especializados como fertilidad podría optimizar los ingresos del consultorio.`
    )
  } else {
    insights.push(
      `Registrar los pagos en el sistema te permitirá obtener métricas claras de ingresos y tomar mejores decisiones sobre precios y servicios.`
    )
  }

  return insights.slice(0, 3)
}
