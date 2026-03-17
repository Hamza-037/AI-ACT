'use client'

import { useTransition } from 'react'
import { Check } from 'lucide-react'
import { createCheckoutSession } from '@/lib/actions/billing'
import type { Plan } from '@/types/shared.types'

type PlanCardProps = {
  planId: Plan
  nom: string
  prix: number
  features: string[]
  isCurrentPlan: boolean
  priceId: string
  recommended?: boolean
}

export function PlanCard({ planId, nom, prix, features, isCurrentPlan, priceId, recommended }: PlanCardProps) {
  const [isPending, startTransition] = useTransition()

  function handleSelect() {
    if (isCurrentPlan || planId === 'gratuit') return
    startTransition(async () => {
      const result = await createCheckoutSession(priceId)
      if (result.success) {
        window.location.href = result.data.url
      }
    })
  }

  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${
        recommended
          ? 'border-2 border-blue-600 shadow-md'
          : 'border-slate-200'
      } ${isCurrentPlan ? 'bg-slate-50' : ''}`}
    >
      {recommended && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-600 text-white">
            Recommande
          </span>
        </div>
      )}

      <div className="mb-4">
        <p className="text-base font-semibold text-slate-900">{nom}</p>
        <div className="flex items-baseline gap-1 mt-2">
          {prix === 0 ? (
            <span className="text-4xl font-bold text-slate-900">Gratuit</span>
          ) : (
            <>
              <span className="text-4xl font-bold text-slate-900">{prix}</span>
              <span className="text-sm text-slate-400">€ / mois</span>
            </>
          )}
        </div>
      </div>

      <ul className="flex-1 space-y-2 mb-6">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
            <span className="text-sm text-slate-600">{feature}</span>
          </li>
        ))}
      </ul>

      {isCurrentPlan ? (
        <div className="inline-flex items-center justify-center h-11 w-full rounded-xl bg-slate-100 text-slate-400 text-sm font-medium cursor-default">
          Votre plan actuel
        </div>
      ) : planId === 'gratuit' ? (
        <div className="inline-flex items-center justify-center h-11 w-full rounded-xl border border-slate-200 text-sm font-medium text-slate-400 cursor-default">
          Inclus
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSelect}
          disabled={isPending}
          className="inline-flex items-center justify-center h-11 w-full rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isPending ? 'Redirection...' : 'Choisir ce plan'}
        </button>
      )}
    </div>
  )
}
