import { createClient } from '@supabase/supabase-js'

/**
 * Clientes del proyecto Supabase DEDICADO a la tienda del ebook.
 * Está totalmente separado del Supabase de citas/OzMedical: usa sus
 * propias variables de entorno y nunca comparte datos.
 */

const url = process.env.NEXT_PUBLIC_EBOOK_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_EBOOK_SUPABASE_ANON_KEY!

/** Cliente de navegador (anon). Se usa para subir el comprobante al Storage. */
export function createEbookBrowserClient() {
  return createClient(url, anonKey)
}

/** Cliente de servidor con service role. Solo en rutas API / server. */
export function createEbookServiceClient() {
  return createClient(url, process.env.EBOOK_SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

/** Buckets de Storage del proyecto del ebook. */
export const PROOFS_BUCKET = 'comprobantes'
export const EBOOK_FILES_BUCKET = 'ebook-files'
