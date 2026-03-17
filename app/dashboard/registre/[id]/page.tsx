type Props = {
  params: Promise<{ id: string }>
}

export default async function SystemeDetailPage({ params }: Props) {
  const { id } = await params

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Système IA</h1>
      <p className="text-muted-foreground">Détail du système {id} — en cours de développement</p>
    </div>
  )
}
