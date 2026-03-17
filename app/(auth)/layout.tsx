import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Panneau gauche — branding */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">aiactio</span>
        </Link>

        <div className="space-y-6">
          <blockquote className="space-y-3">
            <p className="text-xl text-white font-medium leading-relaxed">
              &ldquo;En 20 minutes on avait notre registre complet
              et un plan d&apos;action clair pour l&apos;AI Act.&rdquo;
            </p>
            <footer>
              <p className="text-sm font-semibold text-blue-300">Marie L.</p>
              <p className="text-xs text-slate-400">DRH, PME industrielle — 45 salaries</p>
            </footer>
          </blockquote>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-green-400" />
            Conforme RGPD — Donnees hebergees en Europe
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
            Base sur le texte officiel de l&apos;AI Act (UE) 2024/1689
          </div>
        </div>
      </div>

      {/* Panneau droit — formulaire */}
      <div className="flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm space-y-6">
          {/* Logo mobile */}
          <Link href="/" className="flex lg:hidden items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">aiactio</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  )
}
