import Link from 'next/link'
import { CheckCircle2, Circle, Clock, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LITERACY_MODULES, calculateAttestationEligibility } from '@/lib/literacy/modules'
import { createServerClient } from '@/lib/supabase/server'

async function getCompletions() {
  const supabase = await createServerClient()
  const db = supabase as unknown as {
    auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> }
    from: (t: string) => {
      select: (c: string) => {
        eq: (col: string, val: string) => Promise<{ data: unknown[] | null }>
      }
    }
  }
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data } = await db.from('ai_literacy_completions').select('module_id, completed_at, score').eq('profile_id', user.id)
  return (data ?? []) as { module_id: string; completed_at: string | null; score: number | null }[]
}

export default async function LiteracyPage() {
  const completions = await getCompletions()
  const completedIds = completions.filter((c) => c.completed_at).map((c) => c.module_id)
  const allCompleted = calculateAttestationEligibility(completedIds)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Formation AI Literacy</h1>
          <p className="text-muted-foreground text-sm">3 modules de 15 minutes — Obligatoire depuis le 2 fevrier 2025</p>
        </div>
        <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">En vigueur</Badge>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progression</span>
            <span className="font-bold">{completedIds.length}/3 modules</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full bg-primary transition-all"
              style={{ width: `${(completedIds.length / 3) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Modules */}
      <div className="space-y-3">
        {LITERACY_MODULES.map((module) => {
          const completed = completedIds.includes(module.id)
          const completion = completions.find((c) => c.module_id === module.id)
          return (
            <Card key={module.id} className={completed ? 'border-green-200' : ''}>
              <CardContent className="py-4 flex items-center gap-4">
                {completed
                  ? <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
                  : <Circle className="h-6 w-6 text-muted-foreground shrink-0" />
                }
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{module.titre}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{module.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{module.duree_minutes} minutes</span>
                    {completed && completion?.score !== null && (
                      <span className="text-xs text-green-600 font-medium">Score : {completion?.score}%</span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/dashboard/literacy/${module.id}`}
                  className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent transition-colors shrink-0"
                >
                  {completed ? 'Revoir' : 'Commencer'}
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Attestation */}
      <Card className={allCompleted ? 'border-green-300 bg-green-50' : ''}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-5 w-5" />
            Mon attestation AI Literacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allCompleted ? (
            <div className="space-y-3">
              <p className="text-sm text-green-700">Formation complete. Votre attestation est disponible.</p>
              <Link
                href="/dashboard/literacy/attestation"
                className="inline-flex items-center justify-center h-11 px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Telecharger mon attestation
              </Link>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Completez les 3 modules pour obtenir votre attestation conforme a l&apos;Article 4 de l&apos;AI Act.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
