import Link from 'next/link'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            aiactio
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            aiactio &mdash; Outil d&apos;aide à la conformité AI Act
          </p>
          <p className="text-xs text-muted-foreground">
            Ne remplace pas un conseil juridique
          </p>
        </div>
      </footer>
    </div>
  )
}
