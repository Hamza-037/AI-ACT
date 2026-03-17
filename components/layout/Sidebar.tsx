'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Bot,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Settings,
  LogOut,
  CreditCard,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from '@/lib/actions/auth'

const navGroups = [
  {
    label: null,
    items: [
      { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'CONFORMITE',
    items: [
      { href: '/dashboard/registre', label: 'Registre IA', icon: Bot, exact: false },
      { href: '/dashboard/checklist', label: 'Checklist', icon: ClipboardCheck, exact: false },
      { href: '/dashboard/literacy', label: 'AI Literacy', icon: GraduationCap, exact: false },
      { href: '/dashboard/documents', label: 'Documents', icon: FileText, exact: false },
    ],
  },
  {
    label: 'COMPTE',
    items: [
      { href: '/dashboard/plans', label: 'Abonnement', icon: CreditCard, exact: false },
      { href: '/dashboard/parametres', label: 'Parametres', icon: Settings, exact: false },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const isTestMode = process.env.NODE_ENV !== 'production'

  return (
    <aside className="w-64 min-h-screen flex flex-col bg-[#0f0f1a]">
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0" />
          <span className="text-white font-bold text-base tracking-tight leading-none">
            aiactio
          </span>
          <span className="text-blue-500 font-bold text-base leading-none -ml-1">.</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="text-xs text-slate-600 uppercase tracking-widest px-3 mb-1 font-medium">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 h-9 px-3 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-blue-600/10 text-blue-400 border-r-2 border-blue-500'
                        : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Pied de page */}
      <div className="p-3 border-t border-white/5 space-y-0.5">
        {isTestMode && (
          <div className="px-3 py-1.5 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400">
              mode test
            </span>
          </div>
        )}
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full h-9 px-3 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Se deconnecter
          </button>
        </form>
      </div>
    </aside>
  )
}
