import Link from 'next/link'

type HeaderProps = {
  orgNom?: string | null
  breadcrumb?: string
  plan?: string | null
}

function getInitials(nom: string): string {
  const words = nom.trim().split(/\s+/)
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return nom.slice(0, 2).toUpperCase()
}

const PLAN_LABELS: Record<string, string> = {
  gratuit: 'Gratuit',
  starter: 'Starter',
  pro: 'Pro',
  expert: 'Expert',
}

export function Header({ orgNom, breadcrumb, plan }: HeaderProps) {
  const initials = orgNom ? getInitials(orgNom) : '—'
  const planLabel = plan ? (PLAN_LABELS[plan] ?? plan) : null

  return (
    <header className="border-b border-slate-100 bg-white h-14 flex items-center justify-between px-6 shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link href="/dashboard" className="hover:text-slate-600 transition-colors">
          Dashboard
        </Link>
        {breadcrumb && (
          <>
            <span className="text-slate-200">/</span>
            <span className="text-slate-600 font-medium">{breadcrumb}</span>
          </>
        )}
      </div>

      {/* Actions droite */}
      <div className="flex items-center gap-3">
        {planLabel && (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
            {planLabel}
          </span>
        )}
        {planLabel && (
          <div className="w-px h-4 bg-slate-200" />
        )}
        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold tracking-tight">{initials}</span>
        </div>
      </div>
    </header>
  )
}
