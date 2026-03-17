import Link from 'next/link'
import { Bot, CheckCircle2, Clock, ArrowRight, ClipboardList, GraduationCap } from 'lucide-react'
import { getChecklist } from '@/lib/actions/checklist'
import { getSystems } from '@/lib/actions/systemes'
import { calculerScore, calculerJoursRestants } from '@/lib/utils/conformite'
import { OBLIGATION_LABELS, OBLIGATION_CODES, OBLIGATION_DEADLINES } from '@/types/shared.types'

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

  const actionsPrioritaires = OBLIGATION_CODES.filter((code) => {
    const item = items.find((i) => i.obligation_code === code)
    const statut = item?.statut ?? 'non_evalue'
    return statut === 'non_conforme' || statut === 'non_evalue'
  }).slice(0, 3)

  const modules = [
    {
      href: '/dashboard/registre',
      label: 'Registre IA',
      description: 'Inventoriez et gerez vos systemes IA',
      icon: Bot,
    },
    {
      href: '/dashboard/checklist',
      label: 'Checklist',
      description: 'Suivez vos obligations reglementaires',
      icon: ClipboardList,
    },
    {
      href: '/dashboard/literacy',
      label: 'AI Literacy',
      description: 'Formez vos equipes a l\'IA',
      icon: GraduationCap,
    },
  ]

  return (
    <div className="space-y-8">
      {/* En-tete */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
            Vue d&apos;ensemble
          </p>
          <h1 className="text-xl font-semibold text-slate-900">Bonjour</h1>
          <p className="text-sm text-slate-500 mt-1">
            Voici l&apos;etat de votre conformite AI Act
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-5xl font-bold text-slate-900 leading-none">{score}%</span>
          <span className="text-sm text-slate-500">de conformite</span>
        </div>
      </div>

      {/* 4 cartes metriques */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Score conformite */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Score conformite
          </p>
          <p className="text-4xl font-bold text-slate-900">{score}%</p>
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${scoreColor}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Obligations completees */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Obligations
          </p>
          <p className="text-4xl font-bold text-slate-900">
            {completees}
            <span className="text-xl font-medium text-slate-400">/{totalObligations}</span>
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            {totalObligations - completees} restante{totalObligations - completees !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Jours avant deadline */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Jours restants
            </p>
            <Clock
              className={`h-4 w-4 ${joursRestants < 90 ? 'text-red-400' : 'text-slate-300'}`}
            />
          </div>
          <p
            className={`text-4xl font-bold ${
              joursRestants < 90 ? 'text-red-600' : 'text-slate-900'
            }`}
          >
            {joursRestants}
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">Deadline : 2 aout 2026</p>
        </div>

        {/* Systemes IA */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Systemes IA
            </p>
            <Bot className="h-4 w-4 text-slate-300" />
          </div>
          <p className="text-4xl font-bold text-slate-900">{systems.length}</p>
          <p className="text-sm text-slate-500 leading-relaxed">dans le registre</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* A faire maintenant */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">A faire maintenant</h2>
          {actionsPrioritaires.length === 0 ? (
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
              Toutes les obligations sont traitees.
            </div>
          ) : (
            <div className="space-y-2">
              {actionsPrioritaires.map((code) => {
                const item = items.find((i) => i.obligation_code === code)
                const statut = item?.statut ?? 'non_evalue'
                const isLate = code === 'ai_literacy'

                return (
                  <Link
                    key={code}
                    href={`/dashboard/checklist/${code}`}
                    className={`flex items-center justify-between rounded-xl border p-4 hover:shadow-sm transition-all group ${
                      isLate
                        ? 'bg-red-50 border-red-100 hover:border-red-200'
                        : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {OBLIGATION_LABELS[code]}
                      </p>
                      <p className={`text-xs mt-0.5 ${isLate ? 'text-red-500' : 'text-slate-400'}`}>
                        {OBLIGATION_DEADLINES[code]}
                        {statut === 'non_conforme' && ' — Non conforme'}
                      </p>
                    </div>
                    <ArrowRight
                      className={`h-4 w-4 shrink-0 ml-3 transition-colors ${
                        isLate
                          ? 'text-red-300 group-hover:text-red-400'
                          : 'text-slate-300 group-hover:text-slate-500'
                      }`}
                    />
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Modules */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Modules</h2>
          <div className="space-y-2">
            {modules.map((mod) => {
              const Icon = mod.icon
              return (
                <Link
                  key={mod.href}
                  href={mod.href}
                  className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 hover:border-slate-200 hover:bg-slate-50 transition-all group"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <Icon className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">{mod.label}</p>
                    <p className="text-xs text-slate-400 truncate leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors shrink-0">
                    Acceder
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-300 shrink-0 group-hover:text-slate-500 transition-colors -ml-2" />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
