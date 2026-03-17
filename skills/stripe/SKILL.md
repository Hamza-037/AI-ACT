---
name: aiactio-stripe
description: Patterns d'integration Stripe pour aiactio. Utiliser pour toute creation ou modification du checkout, des webhooks, de la synchronisation des plans, des portails de facturation, ou des guards d'acces. Couvre l'idempotence des webhooks, les evenements a ecouter, et la logique de synchronisation plan.
---

# Stripe — aiactio

## Configuration

- **API version** : `2026-02-25.clover`
- **Mode actuel** : TEST (`sk_test_...`)
- **Instanciation** : uniquement via `getStripe()` dans `lib/stripe/sync.ts`

## Plans et price IDs

```typescript
// lib/stripe/config.ts
export const PLANS = { gratuit: 0, starter: 9900, pro: 29900, expert: 59900 } // centimes
export const PRICE_TO_PLAN: Record<string, Plan> = {
  [process.env.STRIPE_PRICE_STARTER!]: 'starter',
  [process.env.STRIPE_PRICE_PRO!]: 'pro',
  [process.env.STRIPE_PRICE_EXPERT!]: 'expert',
}
```

## Evenements webhook a traiter

| Evenement | Action |
|-----------|--------|
| `checkout.session.completed` | Sync plan depuis subscription |
| `invoice.paid` | Confirmer acces, sync plan |
| `customer.subscription.updated` | Mettre a jour le plan |
| `customer.subscription.deleted` | Retour plan gratuit |

**Ne pas ecouter** : `invoice.payment_failed` (nice-to-have, pas critique pour le MVP)

## Pattern webhook idempotent

```typescript
// 1. Verifier signature
event = await stripe.webhooks.constructEventAsync(body, signature, secret)

// 2. Verifier idempotence (table stripe_webhook_events)
const { data: existing } = await db.from('stripe_webhook_events')
  .select('id').eq('stripe_event_id', event.id).single()
if (existing) return NextResponse.json({ received: true }) // deja traite

// 3. Marquer comme "en cours" avant de traiter
await db.from('stripe_webhook_events').insert({
  stripe_event_id: event.id, event_type: event.type, processed_at: new Date().toISOString()
})

// 4. Traiter l'evenement
// ...

// maxDuration = 30 sur la route
export const maxDuration = 30
```

## Synchronisation plan

```typescript
// lib/stripe/sync.ts
export async function syncPlanFromStripe(customerId: string, plan: Plan) {
  const serviceClient = getServiceRoleClient()
  await serviceClient.from('organizations')
    .update({ plan })
    .eq('stripe_customer_id', customerId)
}
```

## Checkout

```typescript
// lib/actions/billing.ts
export async function createCheckoutSession(priceId: string): Promise<ActionResult<{url: string}>> {
  // auth + org check
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/plans`,
    customer: stripeCustomerId ?? undefined,
    client_reference_id: orgId,
  })
  return { success: true, data: { url: session.url! } }
}
```

## Jamais

- Exposer `STRIPE_SECRET_KEY` cote client
- Faire confiance aux donnees webhook sans verifier la signature
- Traiter deux fois le meme event.id
- Stocker les prix en dur dans la DB (Stripe = source de verite)
