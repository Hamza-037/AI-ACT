'use client'

import { useTransition } from 'react'
import { Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
    <Card className={`relative flex flex-col ${recommended ? 'border-primary shadow-md' : ''}`}>
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground text-xs px-3">Recommande</Badge>
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{nom}</CardTitle>
        <div className="flex items-baseline gap-1 mt-1">
          {prix === 0 ? (
            <span className="text-3xl font-bold">Gratuit</span>
          ) : (
            <>
              <span className="text-3xl font-bold">{prix}€</span>
              <span className="text-muted-foreground text-sm">/mois</span>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-4">
        <ul className="space-y-2 flex-1">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        {isCurrentPlan ? (
          <div className="inline-flex items-center justify-center h-11 w-full rounded-md bg-muted text-muted-foreground text-sm font-medium">
            Plan actuel
          </div>
        ) : planId === 'gratuit' ? (
          <div className="inline-flex items-center justify-center h-11 w-full rounded-md border border-input text-sm font-medium text-muted-foreground">
            Inclus
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSelect}
            disabled={isPending}
            className="inline-flex items-center justify-center h-11 w-full rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Redirection...' : 'Choisir ce plan'}
          </button>
        )}
      </CardContent>
    </Card>
  )
}
