import Link from 'next/link'
import { Bot, CheckCircle2, Clock, ArrowRight, BookOpen, ClipboardList, GraduationCap } from 'lucide-react'
import { getChecklist } from '@/lib/actions/checklist'
import { getSystems } from '@/lib/actions/systemes'
import { calculerScore, calculerJoursRestants } from '@/lib/utils/conformite'
import { OBLIGATION_LABELS, OBLIGATION_CODES } from '@/types/shared.types'
import { Progress } from '@/components/ui/progress'

export default async function DashboardPage() {
  const [checklistResult, systemsResult] = await Promise.all([
    getChecklist(),
    getSystems(),
  ])

  const items = checklistResult.success ? checklistResult.data : []
  const systems = systemsResult.success ? systemsResult.data : []

  const score = calculerScore(items)
  const completees = items.filter((i) => i.statut === 'conforme').length
  const totalObligations = OBLIGATION_CODES.length
  const joursRestants = calculerJoursRestants()

  const scoreColor =
    score >= 67
      ? 'bg-green-500'
      : score >= 34
        ? 'bg-orange-400'
        : 'bg-red-500'

  // Actions prioritaires : 3 premières obligations non conformes ou non évaluées
  const actionsPrioritaires = OBLIGATION_CODES.filter((code) => {
    const item = items.find((i) => i.obligation_code === code)
    const statut = item?.statut ?? 'non_evalue'
    return statut === 'non_conforme' || statut === 'non_evalue'
  }).slice(0, 3)

  const modules = [
    {
      href: '/dashboard/systemes',
      label: 'Registre IA',
      description: 'Inventoriez et gérez vos systèmes IA',
      icon: Bot,
      iconColor: 'text-violet-500',
      bgColor: 'bg-violet-50',
    },
    {
      href: '/dashboard/checklist',
      label: 'Checklist',
      description: 'Suivez vos obligations réglementaires',
      icon: ClipboardList,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      href: '/dashboard/literacy',
      label: 'AI Literacy',
      description: 'Formez vos équipes à l\'IA',
      icon: GraduationCap,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
    },
  ]

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bonjour</h1>
          <p className="text-sm text-slate-500 mt-1">Voici l&apos;état de votre conformité AI Act</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-4xl font-extrabold text-slate-900">{score}%</span>
          <div className="w-48">
            <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${scoreColor}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
          <span className="text-xs text-slate-400">Score de conformité global</span>
        </div>
      </div>

      {/* 4 cartes métriques */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Score conformité */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Score de conformité</span>
            <BookOpen className="h-5 w-5 text-slate-300" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{score}%</p>
          <Progress value={score} className="h-1.5" />
        </div>

        {/* Obligations complétées */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Obligations complétées</span>
            <CheckCircle2 className="h-5 w-5 text-slate-300" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {completees}/{totalObligations}
          </p>
          <p className="text-xs text-slate-400">
            {totalObligations - completees} obligation{totalObligations - completees !== 1 ? 's' : ''} restante{totalObligations - completees !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Jours avant deadline */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Jours avant deadline</span>
            <Clock className={`h-5 w-5 ${joursRestants < 90 ? 'text-red-400' : 'text-slate-300'}`} />
          </div>
          <p className={`text-3xl font-bold ${joursRestants < 90 ? 'text-red-600' : 'text-slate-900'}`}>
            {joursRestants}
          </p>
          <p className="text-xs text-slate-400">2 août 2026</p>
        </div>

        {/* Systèmes IA */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Systèmes IA inventoriés</span>
            <Bot className="h-5 w-5 text-slate-300" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{systems.length}</p>
          <p className="text-xs text-slate-400">
            {systems.length === 0 ? 'Aucun système enregistré' : `Dans votre registre`}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Actions prioritaires */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Actions prioritaires</h2>
          {actionsPrioritaires.length === 0 ? (
            <p className="text-sm text-slate-500">
              Toutes les obligations sont traitées. Excellent travail.
            </p>
          ) : (
            <div className="space-y-3">
              {actionsPrioritaires.map((code) => {
                const item = items.find((i) => i.obligation_code === code)
                const statut = item?.statut ?? 'non_evalue'
                return (
                  <Link
                    key={code}
                    href={`/dashboard/checklist/${code}`}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 hover:border-slate-300 hover:bg-white transition-all group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate group-hover:text-slate-900">
                        {OBLIGATION_LABELS[code]}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {statut === 'non_conforme' ? 'Non conforme' : 'A évaluer'}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 shrink-0 ml-3 group-hover:text-slate-500 transition-colors" />
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Modules */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Modules</h2>
          <div className="space-y-3">
            {modules.map((mod) => {
              const Icon = mod.icon
              return (
                <Link
                  key={mod.href}
                  href={mod.href}
                  className="flex items-center gap-4 rounded-xl border border-slate-100 p-3 hover:border-slate-300 hover:bg-slate-50 transition-all group"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${mod.bgColor}`}>
                    <Icon className={`h-5 w-5 ${mod.iconColor}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">
                      {mod.label}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{mod.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 shrink-0 group-hover:text-slate-500 transition-colors" />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
