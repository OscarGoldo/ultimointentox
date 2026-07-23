'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, BarChart2, Users, TrendingUp, Settings, Wallet, type LucideIcon } from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  CalendarDays,
  BarChart2,
  Users,
  TrendingUp,
  Settings,
  Wallet,
}

interface Props {
  href: string
  label: string
  iconName: string
  mobile?: boolean
}

export default function NavLink({ href, label, iconName, mobile }: Props) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + '/')
  const Icon = ICONS[iconName] ?? CalendarDays

  if (mobile) {
    return (
      <Link
        href={href}
        className={`flex flex-col items-center justify-center gap-1 transition-colors ${
          isActive ? 'text-[#f06292]' : 'text-slate-500 hover:text-[#f06292]'
        }`}
      >
        <Icon size={20} />
        <span className="text-xs font-medium">{label}</span>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium group ${
        isActive
          ? 'bg-[#f06292]/20 text-[#f06292] border border-[#f06292]/30'
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      <Icon
        size={18}
        className={isActive ? 'text-[#f06292]' : 'group-hover:text-[#f06292] transition-colors'}
      />
      {label}
    </Link>
  )
}
