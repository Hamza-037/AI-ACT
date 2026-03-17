'use server'

import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { getOrCreateStripeCustomer, getStripe } from '@/lib/stripe/sync'
import { PLANS } from '@/lib/stripe/config'
import type { ActionResult, Organization, Profile } from '@/types/shared.types'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

// ---------------------------------------------------------------------------
// Schemas Zod
// ---------------------------------------------------------------------------

const checkoutSchema = z.object({
  priceId: z.string().min(1, 'priceId requis').startsWith('price_', 'priceId invalide'),
})

// ---------------------------------------------------------------------------
// Helper auth + org
// ---------------------------------------------------------------------------

type OrgContext =
  | { error: string; supabase: null; user: null; org: null }
  | {
      error: null
      supabase: Awaited<ReturnType<typeof createServerClient>>
      user: { id: string; email?: string | null }
      org: Pick<Organization, 'id' | 'plan' | 'stripe_customer_id' | 'nom'>
    }

async function getAuthOrgContext(): Promise<OrgContext> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié', supabase: null, user: null, org: null }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as unknown as any

  const { data: profile } = (await db
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single()) as { data: Pick<Profile, 'organization_id'> | null }

  if (!profile?.organization_id) {
    return { error: 'Organisation non trouvée', supabase: null, user: null, org: null }
  }

  const { data: org } = (await db
    .from('organizations')
    .select('id, plan, stripe_customer_id, nom')
    .eq('id', profile.organization_id)
    .single()) as { data: Pick<Organization, 'id' | 'plan' | 'stripe_customer_id' | 'nom'> | null }

  if (!org) {
    return { error: 'Organisation non trouvée', supabase: null, user: null, org: null }
  }

  return { error: null, supabase, user, org }
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

/**
 * Crée une session Checkout Stripe pour souscrire à un plan payant.
 */
export async function createCheckoutSession(
  priceId: string
): Promise<ActionResult<{ url: string }>> {
  // Validation Zod
  const parsed = checkoutSchema.safeParse({ priceId })
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const { error, user, org } = await getAuthOrgContext()
  if (error || !user || !org) return { success: false, error: error ?? 'Erreur inconnue' }

  try {
    const customerId = await getOrCreateStripeCustomer(
      org.id,
      user.email ?? '',
      org.nom
    )

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: parsed.data.priceId, quantity: 1 }],
      success_url: `${APP_URL}/dashboard/plans?success=1`,
      cancel_url: `${APP_URL}/dashboard/plans?canceled=1`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    })

    if (!session.url) return { success: false, error: 'URL de paiement indisponible' }
    return { success: true, data: { url: session.url } }
  } catch (err) {
    console.error('createCheckoutSession error:', err)
    return { success: false, error: 'Erreur lors de la création de la session de paiement' }
  }
}

/**
 * Crée une session de portail de facturation Stripe (gestion abonnement).
 */
export async function createBillingPortalSession(): Promise<ActionResult<{ url: string }>> {
  const { error, org } = await getAuthOrgContext()
  if (error || !org) return { success: false, error: error ?? 'Erreur inconnue' }

  const customerId = org.stripe_customer_id
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
    console.error('createBillingPortalSession error:', err)
    return { success: false, error: 'Erreur lors de l\'accès au portail de facturation' }
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
  if (error || !org || !supabase) return { success: false, error: error ?? 'Erreur inconnue' }

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
