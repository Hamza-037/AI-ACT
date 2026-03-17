export const PLANS = {
  gratuit: { nom: 'Gratuit', prix: 0, systemes_max: 0, utilisateurs_max: 1 },
  starter: { nom: 'Starter', prix: 9900, systemes_max: 5, utilisateurs_max: 1 },
  pro: { nom: 'Pro', prix: 29900, systemes_max: -1, utilisateurs_max: 5 },
  expert: { nom: 'Expert', prix: 59900, systemes_max: -1, utilisateurs_max: 20 },
} as const

/**
 * Mapping priceId → plan.
 * Les clés vides (variables d'env absentes) sont exclues pour éviter des faux positifs.
 */
function buildPriceToPlan(): Record<string, 'starter' | 'pro' | 'expert'> {
  const map: Record<string, 'starter' | 'pro' | 'expert'> = {}
  const entries: Array<[string | undefined, 'starter' | 'pro' | 'expert']> = [
    [process.env.STRIPE_PRICE_STARTER, 'starter'],
    [process.env.STRIPE_PRICE_PRO, 'pro'],
    [process.env.STRIPE_PRICE_EXPERT, 'expert'],
  ]
  for (const [priceId, plan] of entries) {
    if (priceId) map[priceId] = plan
  }
  return map
}

export const PRICE_TO_PLAN: Record<string, 'starter' | 'pro' | 'expert'> = buildPriceToPlan()
