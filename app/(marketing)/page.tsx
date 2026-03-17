import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-center mb-4">
        Conformité AI Act simplifiée pour les PME
      </h1>
      <p className="text-xl text-muted-foreground text-center max-w-2xl mb-8">
        Préparez votre entreprise aux obligations de l&apos;AI Act avant le 2 août 2026.
        Simple, guidé, abordable.
      </p>
      <div className="flex gap-4">
        <Link
          href="/quiz"
          className="inline-flex items-center justify-center h-11 px-6 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          Tester mon éligibilité
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center h-11 px-6 rounded-md border border-input bg-background font-medium hover:bg-accent transition-colors"
        >
          Se connecter
        </Link>
      </div>
    </main>
  )
}
