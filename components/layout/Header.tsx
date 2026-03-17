import { User, Bell } from 'lucide-react'
import Link from 'next/link'

type HeaderProps = {
  orgNom?: string | null
  breadcrumb?: string
}

export function Header({ orgNom, breadcrumb }: HeaderProps) {
  return (
    <header className="border-b bg-white h-14 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link href="/dashboard" className="hover:text-slate-700 transition-colors font-medium">
          Dashboard
        </Link>
        {breadcrumb && (
          <>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-medium">{breadcrumb}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        {orgNom && (
          <span className="text-sm font-medium text-slate-500 hidden md:block mr-2 bg-slate-100 px-3 py-1 rounded-full">
            {orgNom}
          </span>
        )}
        <button
          type="button"
          className="inline-flex items-center justify-center size-9 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700"
        >
          <Bell className="h-4 w-4" />
        </button>
        <Link
          href="/dashboard/parametres"
          className="inline-flex items-center justify-center size-9 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
        >
          <User className="h-4 w-4" />
        </Link>
      </div>
    </header>
  )
}
