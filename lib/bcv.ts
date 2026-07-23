/**
 * Tasa EURO oficial del BCV para calcular el monto en bolívares de Pago Móvil.
 * Fuente: DolarAPI Venezuela (endpoint oficial, sin llave).
 *
 * El precio del ebook está en USD, pero por decisión de la doctora el monto
 * en bolívares se calcula con la tasa del EURO BCV: Bs = precioUsd * tasaEuro.
 */

const EURO_BCV_URL = 'https://ve.dolarapi.com/v1/euros/oficial'

export interface BcvRate {
  /** Bolívares por unidad (euro). */
  rate: number
  /** ISO de la última actualización que reporta el BCV. */
  updatedAt: string
}

/**
 * Trae la tasa euro BCV. Cacheada 1 hora vía `next.revalidate` para no
 * golpear la API en cada visita y mantener el monto estable en el checkout.
 * Si la API falla, se propaga el error para que el caller decida el fallback.
 */
export async function getEuroBcvRate(): Promise<BcvRate> {
  const res = await fetch(EURO_BCV_URL, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`BCV API respondió ${res.status}`)
  const data = (await res.json()) as {
    promedio?: number
    fechaActualizacion?: string
  }
  if (typeof data.promedio !== 'number' || !(data.promedio > 0)) {
    throw new Error('Tasa BCV inválida')
  }
  return {
    rate: data.promedio,
    updatedAt: data.fechaActualizacion ?? new Date().toISOString(),
  }
}

/** Convierte USD a bolívares con la tasa dada, redondeado a 2 decimales. */
export function usdToBs(usd: number, rate: number): number {
  return Math.round(usd * rate * 100) / 100
}

/** Formatea un monto en bolívares al estilo venezolano: Bs 16.808,71 */
export function formatBs(amount: number): string {
  return `Bs ${new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`
}

/** Formatea la fecha de la tasa como dd/MM/yyyy. */
export function formatRateDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('es-VE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Caracas',
  }).format(d)
}
