'use server'

import { createServerClient } from '@/lib/supabase/server'
import { getOrCreateStripeCustomer, getStripe } from '@/lib/stripe/sync'
import { PLANS } from '@/lib/stripe/config'
import type { ActionResult } from '@/types/shared.types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

async function getAuthOrgContext() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' as const, supabase, user: null, org: null }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as unknown as any
  const { data: profile } = (await db
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()) as { data: AnyRecord | null }

  if (!profile?.organization_id) {
    return { error: 'Organisation non trouvée' as const, supabase, user: null, org: null }
  }

  const { data: org } = (await db
    .from('organizations')
    .select('id, plan, stripe_customer_id, nom')
    .eq('id', profile.organization_id)
    .single()) as { data: AnyRecord | null }

  if (!org) {
    return { error: 'Organisation non trouvée' as const, supabase, user: null, org: null }
  }

  return { error: null, supabase, user, org }
}

/**
 * Crée une session Checkout Stripe pour souscrire à un plan payant.
 */
export async function createCheckoutSession(
  priceId: string
): Promise<ActionResult<{ url: string }>> {
  const { error, user, org } = await getAuthOrgContext()
  if (error || !user || !org) return { success: false, error: error ?? 'Erreur inconnue' }

  try {
    const customerId = await getOrCreateStripeCustomer(
      org.id as string,
      user.email ?? '',
      org.nom as string
    )

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${APP_URL}/dashboard/plans?success=1`,
      cancel_url: `${APP_URL}/dashboard/plans?canceled=1`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    })

    if (!session.url) return { success: false, error: 'URL de paiement indisponible' }
    return { success: true, data: { url: session.url } }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur Stripe'
    return { success: false, error: message }
  }
}

/**
 * Crée une session de portail de facturation Stripe (gestion abonnement).
 */
export async function createBillingPortalSession(): Promise<ActionResult<{ url: string }>> {
  const { error, org } = await getAuthOrgContext()
  if (error || !org) return { success: false, error: error ?? 'Erreur inconnue' }

  const customerId = org.stripe_customer_id as string | null
  if (!customerId) {
    return { success: false, error: 'Aucun abonnement actif' }
  }

  try {
    const stripe = getStripe()
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${APP_URL}/dashboard/plans`,
    })
    return { success: true, data: { url: session.url } }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur Stripe'
    return { success: false, error: message }
  }
}

/**
 * Récupère le plan actuel et les limites restantes de l'organisation.
 */
export async function getCurrentPlan(): Promise<
  ActionResult<{
    plan: string
    systemes_restants: number
    utilisateurs_restants: number
  }>
> {
  const { error, org, supabase } = await getAuthOrgContext()
  if (error || !org) return { success: false, error: error ?? 'Erreur inconnue' }

  const plan = (org.plan as keyof typeof PLANS) ?? 'gratuit'
  const limits = PLANS[plan]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as unknown as any

  const { count: systemesCount } = (await db
    .from('systemes_ia')
    .select('id', { count: 'exact', head: true })
    .eq('organization_id', org.id)) as { count: number | null }

  const { count: utilisateursCount } = (await db
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('organization_id', org.id)) as { count: number | null }

  const systemesRestants =
    limits.systemes_max === -1
      ? -1
      : Math.max(0, limits.systemes_max - (systemesCount ?? 0))

  const utilisateursRestants = Math.max(
    0,
    limits.utilisateurs_max - (utilisateursCount ?? 0)
  )

  return {
    success: true,
    data: {
      plan,
      systemes_restants: systemesRestants,
      utilisateurs_restants: utilisateursRestants,
    },
  }
}
