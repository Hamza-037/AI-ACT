import { StatCard } from '@/components/dashboard/StatCard'
import { ConformiteScore } from '@/components/dashboard/ConformiteScore'

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <ConformiteScore score={0} />
        <StatCard title="Systèmes IA inventoriés" value={0} description="Registre en cours de création" />
        <StatCard title="Obligations complétées" value="0 / 8" description="Checklist AI Act" />
        <StatCard title="Jours avant échéance" value={503} description="2 août 2026" />
      </div>
      <p className="text-muted-foreground">Bienvenue sur ComplyIA. Commencez par ajouter vos systèmes IA dans le registre.</p>
    </div>
  )
}
