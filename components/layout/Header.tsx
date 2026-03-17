import { User } from 'lucide-react'
import Link from 'next/link'

type HeaderProps = {
  orgNom?: string | null
  breadcrumb?: string
}

export function Header({ orgNom, breadcrumb }: HeaderProps) {
  return (
    <header className="border-b bg-background h-14 flex items-center justify-between px-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        {breadcrumb && (
          <>
            <span>/</span>
            <span className="text-foreground font-medium">{breadcrumb}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        {orgNom && (
          <span className="text-sm font-medium text-muted-foreground hidden md:block">
            {orgNom}
          </span>
        )}
        <Link
          href="/dashboard/parametres"
          className="inline-flex items-center justify-center size-8 rounded-lg hover:bg-muted transition-all"
        >
          <User className="h-5 w-5" />
        </Link>
      </div>
    </header>
  )
}
