import Link from 'next/link'

const navItems = [
  { href: '/dashboard', label: 'Tableau de bord' },
  { href: '/dashboard/registre', label: 'Registre IA' },
  { href: '/dashboard/checklist', label: 'Checklist' },
  { href: '/dashboard/documents', label: 'Documents' },
  { href: '/dashboard/literacy', label: 'AI Literacy' },
  { href: '/dashboard/parametres', label: 'Paramètres' },
]

export function Sidebar() {
  return (
    <aside className="w-64 border-r min-h-screen p-4 bg-background">
      <div className="mb-6">
        <Link href="/" className="text-lg font-bold">
          ComplyIA
        </Link>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center h-10 px-3 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
