import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Heart } from 'lucide-react'
import LogoutButton from './LogoutButton'
import NavLink from './NavLink'
import MobileMoreMenu from './MobileMoreMenu'

const navItems = [
  { href: '/dashboard/hoy', label: 'Hoy', iconName: 'CalendarDays' },
  { href: '/dashboard/mes', label: 'Mes', iconName: 'BarChart2' },
  { href: '/dashboard/pacientes', label: 'Pacientes', iconName: 'Users' },
  { href: '/dashboard/tendencias', label: 'Tendencias', iconName: 'TrendingUp' },
  { href: '/dashboard/finanzas', label: 'Finanzas', iconName: 'Wallet' },
]

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const allowedEmails = (process.env.ALLOWED_EMAILS ?? '').split(',').map((e) => e.trim().toLowerCase())
  if (!allowedEmails.includes(user.email?.toLowerCase() ?? '')) {
    await supabase.auth.signOut()
    redirect('/login?error=unauthorized')
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-60 bg-slate-950 border-r border-slate-800 flex-col z-40">
        {/* Header */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#f06292]/20 border border-[#f06292]/40 flex items-center justify-center flex-shrink-0">
              <Heart className="text-[#f06292]" size={18} fill="currentColor" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Panel</p>
              <p className="text-slate-400 text-xs leading-tight">Dra. Hilda</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ href, label, iconName }) => (
            <NavLink key={href} href={href} label={label} iconName={iconName} />
          ))}
          <NavLink
            href="/dashboard/configuracion/precios"
            label="Configuración"
            iconName="Settings"
          />
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-800">
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <div className="md:pl-60">
        <main className="min-h-screen pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 z-40">
        <div className="grid grid-cols-6 h-16">
          {navItems.map(({ href, label, iconName }) => (
            <NavLink key={href} href={href} label={label} iconName={iconName} mobile />
          ))}
          <MobileMoreMenu />
        </div>
      </nav>
    </div>
  )
}
