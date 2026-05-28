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
