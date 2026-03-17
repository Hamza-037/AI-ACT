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

const navItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/dashboard/registre', label: 'Registre IA', icon: Bot },
  { href: '/dashboard/checklist', label: 'Checklist', icon: ClipboardCheck },
  { href: '/dashboard/literacy', label: 'AI Literacy', icon: GraduationCap },
  { href: '/dashboard/documents', label: 'Documents', icon: FileText },
  { href: '/dashboard/plans', label: 'Abonnement', icon: CreditCard },
  { href: '/dashboard/parametres', label: 'Parametres', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r min-h-screen flex flex-col bg-slate-950">
      {/* Logo */}
      <div className="p-5 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold text-white tracking-tight">aiactio</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 h-10 px-3 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800">
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full h-10 px-3 text-sm font-medium rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Se deconnecter
          </button>
        </form>
      </div>
    </aside>
  )
}
