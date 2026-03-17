import Link from 'next/link'
import { SystemeForm } from '@/components/registre/SystemeForm'

export default function NouveauSystemePage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/registre"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Retour au registre
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-2xl font-bold">Nouveau système IA</h1>
      </div>
      <SystemeForm />
    </div>
  )
}
