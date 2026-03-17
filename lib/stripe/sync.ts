import Stripe from 'stripe'
import { getServiceRoleClient } from '@/lib/supabase/service'
import { PRICE_TO_PLAN } from '@/lib/stripe/config'
import type { Plan } from '@/types/shared.types'

// Typed interface for service-role Supabase client usage in this file
type ServiceDb = {
  from: (table: string) => {
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        single: () => Promise<{ data: { stripe_customer_id?: string; stripe_subscription_id?: string } | null; error: unknown }>
      }
    }
    update: (data: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<{ error: unknown }>
    }
  }
}

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY manquant')
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-02-25.clover' })
}

export function getPlanFromPriceId(priceId: string): Plan {
  return PRICE_TO_PLAN[priceId] ?? 'gratuit'
}

/**
 * Crée ou récupère un customer Stripe pour une organisation.
 * Stocke le customer_id dans la table organizations.
 */
export async function getOrCreateStripeCustomer(
  organizationId: string,
  email: string,
  nom: string
): Promise<string> {
  const supabase = getServiceRoleClient() as unknown as ServiceDb

  const { data: org } = await supabase
    .from('organizations')
    .select('stripe_customer_id')
    .eq('id', organizationId)
    .single()

  if (org?.stripe_customer_id) {
    return org.stripe_customer_id
  }

  const stripe = getStripe()
  const customer = await stripe.customers.create({
    email,
    name: nom,
    metadata: { organization_id: organizationId },
  })

  await supabase
    .from('organizations')
    .update({ stripe_customer_id: customer.id })
    .eq('id', organizationId)

  return customer.id
}

/**
 * Met à jour le plan d'une organisation depuis un customer Stripe.
 */
export async function syncPlanFromStripe(
  customerId: string,
  plan: 'starter' | 'pro' | 'expert' | 'gratuit'
): Promise<void> {
  const supabase = getServiceRoleClient() as unknown as ServiceDb
  await supabase
    .from('organizations')
    .update({ plan })
    .eq('stripe_customer_id', customerId)
}

/**
 * Annule l'abonnement actif d'une organisation et la repasse en plan gratuit.
 */
export async function cancelSubscription(organizationId: string): Promise<void> {
  const supabase = getServiceRoleClient() as unknown as ServiceDb

  const { data: org } = await supabase
    .from('organizations')
    .select('stripe_subscription_id')
    .eq('id', organizationId)
    .single()

  if (org?.stripe_subscription_id) {
    const stripe = getStripe()
    await stripe.subscriptions.cancel(org.stripe_subscription_id)
  }

  await supabase
    .from('organizations')
    .update({ plan: 'gratuit', stripe_subscription_id: null })
    .eq('id', organizationId)
}
