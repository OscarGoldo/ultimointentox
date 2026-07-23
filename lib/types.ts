export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'completed'
  | 'no_show'
  | 'cancelled'

export type PaymentMethod =
  | 'efectivo'
  | 'zelle'
  | 'transferencia'
  | 'binance'
  | 'otro'

export interface Patient {
  id: string
  name: string
  email?: string
  phone?: string
  cedula?: string
  first_visit_date?: string
  last_visit_date?: string
  total_visits: number
  notes?: string
  is_pregnant?: boolean
  pregnancy_start_date?: string
  created_at: string
}

export interface Appointment {
  id: string
  cal_booking_uid?: string
  patient_id?: string
  patient?: Patient
  appointment_date: string
  appointment_time: string
  service_type?: string
  status: AppointmentStatus
  revenue?: number
  payment_method?: PaymentMethod
  payment_notes?: string
  is_first_visit: boolean
  notes?: string
  created_at: string
}

export interface Expense {
  id: string
  date: string
  amount: number
  category: string
  description?: string
  created_at: string
}

export interface Study {
  id: string
  appointment_id?: string
  patient_id: string
  name: string
  description?: string
  file_url?: string
  file_name?: string
  created_at: string
}

export interface ServicePrice {
  id: string
  service_type: string
  label: string
  price: number
}

export interface MonthlyStats {
  month: string
  appointments: number
  revenue: number
  new_patients: number
  completed: number
  no_show: number
}

// ── Tienda del Ebook (Supabase separado) ─────────────────────────────

export type EbookOrderStatus = 'pendiente' | 'confirmada' | 'rechazada'

export type EbookPaymentMethod = 'zelle' | 'pago_movil'

export interface EbookOrder {
  id: string
  customer_name: string
  customer_email: string
  customer_phone?: string | null
  payment_method: EbookPaymentMethod
  /** Precio cobrado en USD (Zelle). */
  amount_usd: number
  /** Monto cotizado en bolívares (Pago Móvil), si aplica. */
  amount_bs?: number | null
  /** Tasa euro BCV usada para el monto en Bs. */
  bcv_rate?: number | null
  payment_reference?: string | null
  /** Ruta del comprobante dentro del bucket `comprobantes`. */
  proof_path?: string | null
  status: EbookOrderStatus
  /** Momento en que la doctora confirmó el pago. */
  confirmed_at?: string | null
  created_at: string
}
