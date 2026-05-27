'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Heart } from 'lucide-react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  const supabase = createClient()

  useEffect(() => {
    if (searchParams.get('error') === 'unauthorized') {
      setError('Este correo no tiene acceso al panel.')
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const origin = window.location.origin

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      setError('No se pudo enviar el enlace. Verifica tu correo e intenta de nuevo.')
    } else {
      setSent(true)
    }

    setLoading(false)
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
      {sent ? (
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-400/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-emerald-400 text-2xl">✓</span>
          </div>
          <h2 className="text-white font-semibold text-lg mb-2">Enlace enviado</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Revisa tu correo <span className="text-white font-medium">{email}</span> y haz clic
            en el enlace de acceso.
          </p>
          <button
            onClick={() => { setSent(false); setEmail('') }}
            className="mt-5 text-[#f06292] text-sm hover:underline"
          >
            Usar otro correo
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@correo.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#f06292] focus:ring-1 focus:ring-[#f06292] transition-colors text-sm"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-3 px-4 rounded-xl bg-[#f06292] hover:bg-[#e91e8c] disabled:bg-[#f06292]/40 disabled:cursor-not-allowed text-white font-semibold transition-colors text-sm"
          >
            {loading ? 'Enviando...' : 'Enviar enlace de acceso'}
          </button>
        </form>
      )}
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#f06292]/20 border border-[#f06292]/40 flex items-center justify-center mb-4">
            <Heart className="text-[#f06292]" size={28} fill="currentColor" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Hilda Díaz <span className="text-[#f06292]">·</span> Panel
          </h1>
          <p className="text-slate-400 text-sm mt-1">Panel interno — solo uso autorizado</p>
        </div>

        <Suspense fallback={<div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 h-40" />}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-slate-600 text-xs mt-6">
          Dra. Hilda Mary Díaz García · Ginecóloga
        </p>
      </div>
    </div>
  )
}
