// Synchronisation des plans Stripe vers la base de données
// Utilisé par le webhook Stripe uniquement

import { PRICE_TO_PLAN } from './config'
import type { Plan } from '@/types/shared.types'

export function getPlanFromPriceId(priceId: string): Plan {
  return PRICE_TO_PLAN[priceId] ?? 'gratuit'
}
