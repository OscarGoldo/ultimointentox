'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MoreHorizontal, Settings, LogOut, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function MobileMoreMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-[#f06292] transition-colors"
      >
        <MoreHorizontal size={20} />
        <span className="text-xs font-medium">Más</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => setOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 rounded-t-2xl">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <p className="text-white font-semibold">Menú</p>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>
            <div className="px-4 pb-8 space-y-1">
              <Link
                href="/dashboard/configuracion/precios"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium"
              >
                <Settings size={18} className="text-slate-400" />
                Configuración
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-300 hover:text-red-400 hover:bg-red-400/10 transition-colors text-sm font-medium w-full text-left"
              >
                <LogOut size={18} className="text-slate-400" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
