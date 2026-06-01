import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

// Mon–Fri slots (08:00–12:00 and 14:00–17:00), one per hour
const ALL_SLOTS = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
const HOURS_AHEAD = 4

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date')
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'date param required (YYYY-MM-DD)' }, { status: 400 })
  }

  // Reject weekends
  const day = new Date(date + 'T12:00:00').getDay()
  if (day === 0 || day === 6) {
    return NextResponse.json({ available: [], taken: ALL_SLOTS })
  }

  const supabase = createServiceClient()

  // Check if date is blocked by the doctor
  const { data: blocked } = await supabase
    .from('blocked_dates')
    .select('id')
    .eq('date', date)
    .maybeSingle()
  if (blocked) return NextResponse.json({ available: [], taken: ALL_SLOTS, blocked: true })

  const { data } = await supabase
    .from('appointments')
    .select('appointment_time')
    .eq('appointment_date', date)
    .not('status', 'in', '("cancelled","no_show")')

  const taken = (data || []).map(a => a.appointment_time.slice(0, 5))
  let available = ALL_SLOTS.filter(s => !taken.includes(s))

  // Skip 4-hour restriction for admin/manual bookings
  const isAdmin = request.nextUrl.searchParams.get('admin') === '1'
  const todayStr = new Date().toISOString().split('T')[0]
  if (!isAdmin && date === todayStr) {
    const cutoff = new Date(Date.now() + HOURS_AHEAD * 60 * 60 * 1000)
    available = available.filter(slot => {
      const [h, m] = slot.split(':')
      const slotTime = new Date()
      slotTime.setHours(parseInt(h), parseInt(m), 0, 0)
      return slotTime >= cutoff
    })
  }

  return NextResponse.json({ available, taken })
}
