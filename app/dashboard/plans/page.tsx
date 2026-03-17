import { createServerClient } from '@/lib/supabase/server'
import { PlanCard } from '@/components/plans/PlanCard'
import { PLAN_FEATURES, PLAN_PRICES, PLAN_NAMES } from '@/lib/plans/data'
import { Badge } from '@/components/ui/badge'
import type { Plan } from '@/types/shared.types'

async function getOrgPlan(): Promise<{ plan: Plan; stripeCustomerId: string | null }> {
  const supabase = await createServerClient()
  const db = supabase as unknown as {
    auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> }
    from: (t: string) => {
      select: (c: string) => {
        eq: (col: string, val: string) => {
          single: () => Promise<{ data: unknown }>
        }
      }
    }
  }
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { plan: 'gratuit', stripeCustomerId: null }
  const { data: profile } = await db.from('profiles').select('organization_id').eq('id', user.id).single() as { data: { organization_id: string | null } | null }
  if (!profile?.organization_id) return { plan: 'gratuit', stripeCustomerId: null }
  const { data: org } = await db.from('organizations').select('plan, stripe_customer_id').eq('id', profile.organization_id).single() as { data: { plan: Plan; stripe_customer_id: string | null } | null }
  return { plan: org?.plan ?? 'gratuit', stripeCustomerId: org?.stripe_customer_id ?? null }
}

const PLANS_ORDER: Plan[] = ['gratuit', 'starter', 'pro', 'expert']

const PRICE_IDS: Record<Plan, string> = {
  gratuit: '',
  starter: process.env.STRIPE_PRICE_STARTER ?? '',
  pro: process.env.STRIPE_PRICE_PRO ?? '',
  expert: process.env.STRIPE_PRICE_EXPERT ?? '',
}

export default async function PlansPage() {
  const { plan: currentPlan } = await getOrgPlan()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Plans & Abonnement</h1>
          <p className="text-muted-foreground text-sm">Choisissez le plan adapte a votre entreprise.</p>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20">
          Plan actuel : {PLAN_NAMES[currentPlan]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PLANS_ORDER.map((planId) => (
          <PlanCard
            key={planId}
            planId={planId}
            nom={PLAN_NAMES[planId]}
            prix={PLAN_PRICES[planId]}
            features={PLAN_FEATURES[planId]}
            isCurrentPlan={currentPlan === planId}
            priceId={PRICE_IDS[planId]}
            recommended={planId === 'pro'}
          />
        ))}
      </div>

      <p className="text-xs text-slate-400 text-center">
        Prix HT · Facturation mensuelle · Annulation a tout moment
      </p>
    </div>
  )
}
