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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from '@/lib/actions/auth'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/registre', label: 'Registre IA', icon: Bot },
  { href: '/dashboard/checklist', label: 'Checklist', icon: ClipboardCheck },
  { href: '/dashboard/documents', label: 'Documents', icon: FileText },
  { href: '/dashboard/literacy', label: 'AI Literacy', icon: GraduationCap },
  { href: '/dashboard/parametres', label: 'Parametres', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r min-h-screen flex flex-col bg-background">
      <div className="p-4 border-b">
        <Link href="/dashboard" className="text-lg font-bold tracking-tight">
          aiactio
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
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
                'flex items-center gap-3 h-10 px-3 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t">
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full h-10 px-3 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Se deconnecter
          </button>
        </form>
      </div>
    </aside>
  )
}
