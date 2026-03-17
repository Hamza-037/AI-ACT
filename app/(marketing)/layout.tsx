import Link from 'next/link'
import { NavMobile } from './NavMobile'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-base font-bold text-slate-900 tracking-tight">
              aiactio<span className="text-blue-600">·</span>
            </span>
          </Link>

          {/* Navigation centree — desktop */}
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link
              href="/#fonctionnalites"
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              Fonctionnalites
            </Link>
            <Link
              href="/#tarifs"
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              Tarifs
            </Link>
            <Link
              href="/#apropos"
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              A propos
            </Link>
          </nav>

          {/* Actions droite — desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              Commencer
            </Link>
          </div>

          {/* Burger — mobile */}
          <NavMobile />
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer style={{ backgroundColor: '#0f0f0f' }} className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
            {/* Colonne 1 : Marque */}
            <div className="space-y-3">
              <span className="text-base font-bold text-white tracking-tight">
                aiactio<span className="text-blue-500">·</span>
              </span>
              <p className="text-sm text-slate-400 leading-relaxed">
                Conformite AI Act pour les PME fran&ccedil;aises.
              </p>
              <p className="text-xs text-slate-600">
                Conforme au texte officiel AI Act (UE)&nbsp;2024/1689
              </p>
            </div>

            {/* Colonne 2 : Produit */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Produit
              </h3>
              <div className="space-y-2">
                <Link
                  href="/#fonctionnalites"
                  className="block text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Fonctionnalites
                </Link>
                <Link
                  href="/#tarifs"
                  className="block text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Tarifs
                </Link>
                <Link
                  href="/quiz"
                  className="block text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Quiz gratuit
                </Link>
                <Link
                  href="/signup"
                  className="block text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Inscription
                </Link>
              </div>
            </div>

            {/* Colonne 3 : Mentions legales */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Informations
              </h3>
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Connexion
                </Link>
                <span className="block text-sm text-slate-600">Mentions l&eacute;gales</span>
                <span className="block text-sm text-slate-600">
                  Politique de confidentialit&eacute;
                </span>
              </div>
              <p className="text-xs text-slate-700 pt-2">
                Outil d&apos;aide &agrave; la conformit&eacute;. Ne remplace pas un conseil
                juridique.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6">
            <p className="text-xs text-slate-600 text-center">
              &copy; {new Date().getFullYear()} aiactio &mdash; Tous droits r&eacute;serv&eacute;s
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
