'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Database,
  CheckSquare,
  FileText,
  GraduationCap,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/registre', label: 'Registre IA', icon: Database },
  { href: '/dashboard/checklist', label: 'Checklist conformité', icon: CheckSquare },
  { href: '/dashboard/documents', label: 'Documents', icon: FileText },
  { href: '/dashboard/literacy', label: 'AI Literacy', icon: GraduationCap },
  { href: '/dashboard/parametres', label: 'Paramètres', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r min-h-screen p-4 bg-background">
      <div className="mb-6">
        <Link href="/" className="text-lg font-bold">
          ComplyIA
        </Link>
      </div>
      <nav className="space-y-1">
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
                'flex items-center gap-3 h-10 px-3 text-sm font-medium rounded-md transition-colors duration-200',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
