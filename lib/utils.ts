import { format, formatDistanceToNow, parseISO, isToday, isValid } from 'date-fns'
import { es } from 'date-fns/locale'
import { AppointmentStatus, PaymentMethod } from './types'

export function formatDate(dateStr: string): string {
  try {
    const date = parseISO(dateStr)
    if (!isValid(date)) return dateStr
    return format(date, "d 'de' MMMM 'de' yyyy", { locale: es })
  } catch {
    return dateStr
  }
}

export function formatDateShort(dateStr: string): string {
  try {
    const date = parseISO(dateStr)
    if (!isValid(date)) return dateStr
    return format(date, 'dd/MM/yyyy', { locale: es })
  } catch {
    return dateStr
  }
}

export function formatTime(timeStr: string): string {
  try {
    const [hours, minutes] = timeStr.split(':')
    const h = parseInt(hours)
    const m = minutes || '00'
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${m} ${ampm}`
  } catch {
    return timeStr
  }
}

export function formatRelative(dateStr: string): string {
  try {
    const date = parseISO(dateStr)
    if (!isValid(date)) return dateStr
    if (isToday(date)) return 'Hoy'
    return formatDistanceToNow(date, { addSuffix: true, locale: es })
  } catch {
    return dateStr
  }
}

export function formatCurrency(amount: number | undefined | null): string {
  if (amount == null) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function getStatusColor(status: AppointmentStatus): string {
  const colors: Record<AppointmentStatus, string> = {
    scheduled: 'bg-amber-400/20 text-amber-400 border-amber-400/30',
    confirmed: 'bg-blue-400/20 text-blue-400 border-blue-400/30',
    completed: 'bg-emerald-400/20 text-emerald-400 border-emerald-400/30',
    no_show: 'bg-red-400/20 text-red-400 border-red-400/30',
    cancelled: 'bg-slate-400/20 text-slate-400 border-slate-400/30',
  }
  return colors[status] || 'bg-slate-400/20 text-slate-400 border-slate-400/30'
}

export function getStatusLabel(status: AppointmentStatus): string {
  const labels: Record<AppointmentStatus, string> = {
    scheduled: 'Programada',
    confirmed: 'Confirmada',
    completed: 'Completada',
    no_show: 'No se presentó',
    cancelled: 'Cancelada',
  }
  return labels[status] || status
}

export function getPaymentLabel(method: PaymentMethod | undefined): string {
  if (!method) return '—'
  const labels: Record<PaymentMethod, string> = {
    efectivo: 'Efectivo',
    zelle: 'Zelle',
    transferencia: 'Transferencia',
    binance: 'Binance',
    otro: 'Otro',
  }
  return labels[method] || method
}

export const SERVICE_LABELS: Record<string, string> = {
  'control-prenatal': 'Control Prenatal',
  'ginecologia': 'Ginecología General',
  'fertilidad': 'Fertilidad / Reproducción',
  'planificacion': 'Planificación Familiar',
  'menopausia': 'Menopausia y Climaterio',
  'otro': 'Otro',
}

export function getServiceLabel(serviceType: string | undefined): string {
  if (!serviceType) return 'Sin especificar'
  return SERVICE_LABELS[serviceType] || serviceType
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}

export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function getMonthRange(year: number, month: number): { start: string; end: string } {
  const start = format(new Date(year, month, 1), 'yyyy-MM-dd')
  const end = format(new Date(year, month + 1, 0), 'yyyy-MM-dd')
  return { start, end }
}
