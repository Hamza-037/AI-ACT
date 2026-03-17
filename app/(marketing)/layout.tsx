import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">aiactio</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors"
            >
              Essai gratuit
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-slate-900 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <ShieldCheck className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">aiactio</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <Link href="/quiz" className="hover:text-slate-300 transition-colors">Quiz gratuit</Link>
              <Link href="/login" className="hover:text-slate-300 transition-colors">Connexion</Link>
              <Link href="/signup" className="hover:text-slate-300 transition-colors">Inscription</Link>
            </div>
            <div className="text-center sm:text-right space-y-1">
              <p className="text-xs text-slate-500">Outil d&apos;aide a la conformite AI Act</p>
              <p className="text-xs text-slate-600">Ne remplace pas un conseil juridique</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
