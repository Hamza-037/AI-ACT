import Link from 'next/link'
import { CheckCircle2, AlertCircle, Circle, XCircle, Clock, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getChecklist } from '@/lib/actions/checklist'
import { OBLIGATION_LABELS, OBLIGATION_DEADLINES, OBLIGATION_CODES } from '@/types/shared.types'
import { calculerScore, calculerJoursRestants } from '@/lib/utils/conformite'
import type { StatutConformite, ObligationCode } from '@/types/shared.types'

function StatutIcon({ statut }: { statut: StatutConformite }) {
  if (statut === 'conforme') return <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
  if (statut === 'en_cours') return <AlertCircle className="h-5 w-5 text-orange-500 shrink-0" />
  if (statut === 'non_conforme') return <XCircle className="h-5 w-5 text-red-600 shrink-0" />
  return <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
}

function StatutBadge({ statut }: { statut: StatutConformite }) {
  const map: Record<StatutConformite, { label: string; className: string }> = {
    conforme: { label: 'Conforme', className: 'bg-green-100 text-green-800' },
    en_cours: { label: 'En cours', className: 'bg-orange-100 text-orange-800' },
    non_conforme: { label: 'Non conforme', className: 'bg-red-100 text-red-800' },
    non_evalue: { label: 'A evaluer', className: 'bg-muted text-muted-foreground' },
  }
  const { label, className } = map[statut]
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${className}`}>{label}</span>
}

export default async function ChecklistPage() {
  const result = await getChecklist()
  const items = result.success ? result.data : []
  const joursRestants = calculerJoursRestants()

  // Construire une map par code
  const itemByCode = new Map(items.map((i) => [i.obligation_code, i]))

  // Score
  const allItems = OBLIGATION_CODES.map((code) => ({
    statut: itemByCode.get(code)?.statut ?? 'non_evalue',
  }))
  const score = calculerScore(allItems)
  const completees = allItems.filter((i) => i.statut === 'conforme').length

  // Urgence : ai_literacy est déjà en retard (2025)
  const urgents: ObligationCode[] = ['ai_literacy']
  const normaux: ObligationCode[] = OBLIGATION_CODES.filter((c) => c !== 'ai_literacy')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Checklist de conformite</h1>
        <p className="text-muted-foreground text-sm">Suivez vos obligations AI Act et leur progression.</p>
      </div>

      {/* Progress + deadline */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Score de conformite</span>
              <span className="text-2xl font-bold">{score}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all ${score >= 67 ? 'bg-green-500' : score >= 34 ? 'bg-orange-500' : 'bg-red-500'}`}
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{completees}/8 obligations completees</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <Clock className={`h-8 w-8 shrink-0 ${joursRestants < 90 ? 'text-red-500' : joursRestants < 180 ? 'text-orange-500' : 'text-muted-foreground'}`} />
            <div>
              <p className="text-2xl font-bold">{joursRestants} jours</p>
              <p className="text-xs text-muted-foreground">avant la deadline du 2 aout 2026</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action immediate */}
      <div>
        <h2 className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-3">Action immediate requise</h2>
        <div className="space-y-2">
          {urgents.map((code) => {
            const item = itemByCode.get(code)
            const statut: StatutConformite = item?.statut ?? 'non_evalue'
            return (
              <Card key={code} className="border-red-200">
                <CardContent className="py-4 flex items-center gap-4">
                  <StatutIcon statut={statut} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{OBLIGATION_LABELS[code]}</p>
                    <p className="text-xs text-red-600 font-medium">{OBLIGATION_DEADLINES[code]}</p>
                    {statut === 'non_evalue' && (
                      <p className="text-xs text-red-700 mt-1">Cette obligation est deja en vigueur. Action immediate requise.</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatutBadge statut={statut} />
                    <Link href={`/dashboard/checklist/${code}`} className="p-1.5 hover:bg-accent rounded">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Avant aout 2026 */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Avant le 2 aout 2026</h2>
        <div className="space-y-2">
          {normaux.map((code) => {
            const item = itemByCode.get(code)
            const statut: StatutConformite = item?.statut ?? 'non_evalue'
            return (
              <Card key={code}>
                <CardContent className="py-4 flex items-center gap-4">
                  <StatutIcon statut={statut} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{OBLIGATION_LABELS[code]}</p>
                    <p className="text-xs text-muted-foreground">{OBLIGATION_DEADLINES[code]}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatutBadge statut={statut} />
                    <Link href={`/dashboard/checklist/${code}`} className="p-1.5 hover:bg-accent rounded">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
