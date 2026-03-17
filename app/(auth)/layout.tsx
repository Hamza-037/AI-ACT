import Link from 'next/link'
import { Check } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* =========================================================
          Panneau gauche — branding
      ========================================================= */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-900 p-12">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold text-white tracking-tight">
            aiactio<span className="text-blue-500">·</span>
          </span>
        </Link>

        {/* Centre : phrase de marque + points de reassurance */}
        <div className="space-y-10">
          <div className="space-y-2">
            <p className="text-2xl font-semibold text-white leading-snug">
              La conformit&eacute; AI Act, simplifi&eacute;e pour les PME.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Inventaire, checklist, formations et documents officiels &mdash; tout en un.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-blue-400 shrink-0" />
              <span className="text-sm text-slate-300">
                Donn&eacute;es h&eacute;berg&eacute;es en Europe
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-blue-400 shrink-0" />
              <span className="text-sm text-slate-300">
                Bas&eacute; sur le texte officiel AI Act (UE)&nbsp;2024/1689
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-blue-400 shrink-0" />
              <span className="text-sm text-slate-300">
                Gratuit pour commencer, sans carte bancaire
              </span>
            </div>
          </div>
        </div>

        {/* Citation client en bas */}
        <div className="space-y-3 border-t border-slate-800 pt-8">
          <p className="text-sm text-slate-300 italic leading-relaxed">
            &ldquo;En 20 minutes on avait notre registre complet et un plan d&apos;action clair
            pour l&apos;AI Act.&rdquo;
          </p>
          <div>
            <p className="text-sm font-medium text-slate-200">Marie L.</p>
            <p className="text-xs text-slate-500">
              DRH, PME industrielle &mdash; 45 salari&eacute;s
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================
          Panneau droit — formulaire
      ========================================================= */}
      <div className="flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm space-y-6">
          {/* Logo mobile */}
          <Link href="/" className="flex lg:hidden items-center mb-8">
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              aiactio<span className="text-blue-600">·</span>
            </span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  )
}
