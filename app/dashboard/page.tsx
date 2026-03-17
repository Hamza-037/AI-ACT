import Link from 'next/link'
import { Bot, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { ConformiteScore } from '@/components/dashboard/ConformiteScore'
import { createServerClient } from '@/lib/supabase/server'
import { calculerScore, calculerJoursRestants } from '@/lib/utils/conformite'
import { OBLIGATION_LABELS, OBLIGATION_DEADLINES } from '@/types/shared.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

async function getDashboardData() {
  const supabase = await createServerClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as unknown as any

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = (await db
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()) as { data: AnyRecord | null }

  if (!profile?.organization_id) return null

  const orgId = profile.organization_id as string

  // Systèmes IA
  const { count: countSystemes } = (await db
    .from('systemes_ia')
    .select('id', { count: 'exact', head: true })
    .eq('organization_id', orgId)) as { count: number | null }

  // Checklist items
  const { data: checklistItems } = (await db
    .from('checklist_items')
    .select('obligation_code, statut')
    .eq('organization_id', orgId)) as { data: { obligation_code: string; statut: string }[] | null }

  // AI Literacy completions
  const { count: countLiteracy } = (await db
    .from('ai_literacy_completions')
    .select('id', { count: 'exact', head: true })
    .eq('organization_id', orgId)) as { count: number | null }

  const items: { obligation_code: string; statut: string }[] = checklistItems ?? []
  const score = calculerScore(items)
  const completees = items.filter((i) => i.statut === 'conforme').length
  const totalItems = items.length
  const joursRestants = calculerJoursRestants()

  // Vérifier AI Literacy
  const aiLiteracyItem = items.find((i) => i.obligation_code === 'ai_literacy')
  const aiLiteracyNonCommencee = !aiLiteracyItem || aiLiteracyItem.statut === 'non_evalue'

  return {
    countSystemes: countSystemes ?? 0,
    score,
    completees,
    totalItems,
    countLiteracy: countLiteracy ?? 0,
    joursRestants,
    aiLiteracyNonCommencee,
    checklistItems: items,
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  if (!data) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Chargement des données...{' '}
          <Link href="/onboarding" className="text-primary hover:underline">
            Configurer mon compte
          </Link>
        </p>
      </div>
    )
  }

  const {
    countSystemes,
    score,
    completees,
    totalItems,
    countLiteracy,
    joursRestants,
    aiLiteracyNonCommencee,
    checklistItems,
  } = data

  const scoreVariante =
    score >= 67 ? 'success' : score >= 34 ? 'warning' : 'danger'

  const joursVariante =
    joursRestants < 30 ? 'danger' : joursRestants < 90 ? 'warning' : 'default'

  // Obligations avec deadlines pour "Prochaines deadlines"
  const obligationCodes = Object.keys(OBLIGATION_LABELS) as Array<
    keyof typeof OBLIGATION_LABELS
  >
  const deadlineItems = obligationCodes.slice(0, 5).map((code) => {
    const item = checklistItems.find((i) => i.obligation_code === code)
    return {
      code,
      label: OBLIGATION_LABELS[code],
      deadline: OBLIGATION_DEADLINES[code],
      statut: (item?.statut ?? 'non_evalue') as string,
    }
  })

  const statutLabel: Record<string, string> = {
    conforme: 'Conforme',
    en_cours: 'En cours',
    non_conforme: 'Non conforme',
    non_evalue: 'A evaluer',
  }
  const statutColor: Record<string, string> = {
    conforme: 'text-green-600',
    en_cours: 'text-orange-500',
    non_conforme: 'text-red-600',
    non_evalue: 'text-muted-foreground',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>

      {/* 4 StatCards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          titre="Systemes IA inventories"
          valeur={countSystemes}
          description="Registre des outils IA"
          icon={<Bot className="h-5 w-5" />}
          variante={countSystemes === 0 ? 'warning' : 'default'}
        />
        <ConformiteScore score={score} completees={completees} total={totalItems || 8} />
        <StatCard
          titre="Salaries formes AI Literacy"
          valeur={countLiteracy}
          description="Obligation en vigueur"
          icon={<CheckCircle2 className="h-5 w-5" />}
          variante={countLiteracy === 0 ? 'danger' : 'success'}
        />
        <StatCard
          titre="Jours avant deadline"
          valeur={joursRestants}
          description="2 aout 2026"
          icon={<Clock className="h-5 w-5" />}
          variante={joursVariante}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Actions prioritaires */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actions prioritaires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiLiteracyNonCommencee && (
              <div className="flex items-start gap-3 rounded-md bg-red-50 border border-red-200 p-3">
                <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Formation AI Literacy</p>
                  <p className="text-xs text-red-600">
                    Obligation deja en vigueur depuis fevrier 2025
                  </p>
                </div>
              </div>
            )}
            {countSystemes === 0 && (
              <div className="flex items-start gap-3 rounded-md bg-orange-50 border border-orange-200 p-3">
                <Bot className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800">Inventaire IA vide</p>
                  <p className="text-xs text-orange-600">
                    Commencez par inventorier vos outils IA
                  </p>
                </div>
              </div>
            )}
            {score < 50 && totalItems > 0 && (
              <div className="flex items-start gap-3 rounded-md bg-yellow-50 border border-yellow-200 p-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Conformite insuffisante</p>
                  <p className="text-xs text-yellow-600">
                    {totalItems - completees} obligation
                    {totalItems - completees > 1 ? 's' : ''} en attente
                  </p>
                </div>
              </div>
            )}
            {!aiLiteracyNonCommencee && countSystemes > 0 && score >= 50 && (
              <p className="text-sm text-muted-foreground">
                Bonne progression ! Continuez sur la checklist.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Prochaines deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Prochaines deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {deadlineItems.map((item) => (
                <Link
                  key={item.code}
                  href="/dashboard/checklist"
                  className="flex items-center justify-between rounded-md p-2 hover:bg-accent transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-primary">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.deadline}</p>
                  </div>
                  <span
                    className={`text-xs font-medium shrink-0 ml-2 ${statutColor[item.statut] ?? 'text-muted-foreground'}`}
                  >
                    {statutLabel[item.statut] ?? 'A evaluer'}
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
