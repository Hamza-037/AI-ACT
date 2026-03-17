import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SystemeForm } from '@/components/registre/SystemeForm'
import { getSystemById } from '@/lib/actions/systemes'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ModifierSystemePage({ params }: Props) {
  const { id } = await params
  const result = await getSystemById(id)

  if (!result.success) {
    notFound()
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={`/dashboard/registre/${id}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Retour
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-2xl font-bold">Modifier — {result.data.nom}</h1>
      </div>
      <SystemeForm systeme={result.data} />
    </div>
  )
}
