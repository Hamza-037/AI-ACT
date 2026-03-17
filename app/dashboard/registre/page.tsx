import Link from 'next/link'

export default function RegistrePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Registre des systèmes IA</h1>
        <Link
          href="/dashboard/registre/nouveau"
          className="inline-flex items-center justify-center h-11 px-6 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          Ajouter un système
        </Link>
      </div>
      <p className="text-muted-foreground">Aucun système IA enregistré pour le moment.</p>
    </div>
  )
}
