---
name: aiactio-stripe
description: Utiliser quand on modifie le checkout, les webhooks, la synchronisation des plans, le portail de facturation, ou les guards d'acces dans aiactio. Contient les price IDs exacts, les patterns idempotents, les gotchas Stripe frequents, et les evenements a ecouter.
---

# Stripe — aiactio

## Structure du skill

- `references/webhook-events.md` — tous les evenements, ce qu'ils declenchent
- `references/plan-mapping.md` — price IDs → plans, logique de sync
- `scripts/verify-webhook.sh` — test local du webhook avec stripe CLI

## Configuration actuelle

- **API version** : `2026-02-25.clover`
- **Mode** : TEST (`sk_test_...`) — basculer en LIVE quand deploiement pret
- **Instanciation** : uniquement via `getStripe()` dans `lib/stripe/sync.ts`
- **Ne jamais** instancier `new Stripe()` directement ailleurs

## Price IDs (TEST)

```typescript
// lib/stripe/config.ts — source de verite
STRIPE_PRICE_STARTER = 'price_1TByzZPdu9Gz4yoEj1hVRS4O'   // 99€/mois
STRIPE_PRICE_PRO     = 'price_1TByzhPdu9Gz4yoEpeEO3Ew2'   // 299€/mois
STRIPE_PRICE_EXPERT  = 'price_1TByzqPdu9Gz4yoEcBi5qJc6'   // 599€/mois
```

## Plans et montants

```typescript
// Toujours en centimes — jamais de float
export const PLANS = {
  gratuit: 0,
  starter: 9900,   // 99€
  pro: 29900,      // 299€
  expert: 59900,   // 599€
} as const
```

## Evenements webhook a traiter

| Evenement | Action requise |
|-----------|---------------|
| `checkout.session.completed` | Sync plan depuis `subscription` |
| `invoice.paid` | Confirmer acces, sync plan |
| `customer.subscription.updated` | Mettre a jour le plan |
| `customer.subscription.deleted` | Retour plan gratuit |

Ne pas traiter : `invoice.payment_failed` (pas critique pour le MVP)

## Pattern webhook idempotent complet

```typescript
// app/api/stripe/webhook/route.ts
export const maxDuration = 30

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')
  if (!signature) return NextResponse.json({ error: 'No signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body, signature, process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Idempotence — verifier si deja traite
  const supabase = getServiceRoleClient()
  const { data: existing } = await supabase
    .from('stripe_webhook_events')
    .select('id').eq('stripe_event_id', event.id).maybeSingle()
  if (existing) return NextResponse.json({ received: true })

  // Marquer avant traitement (evite les doubles traitements en cas de retry)
  await supabase.from('stripe_webhook_events').insert({
    stripe_event_id: event.id,
    event_type: event.type,
    processed_at: new Date().toISOString(),
  })

  // Dispatcher
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
      break
    case 'customer.subscription.updated':
    case 'invoice.paid':
      await handleSubscriptionUpdate(event.data.object)
      break
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
      break
  }

  return NextResponse.json({ received: true })
}
```

## Gotchas — erreurs frequentes

**G1 : instancier `new Stripe()` au top-level**
Plante si `STRIPE_SECRET_KEY` est absent (build CI, tests).
Toujours via `getStripe()` qui lazy-load.

**G2 : ne pas verifier la signature du webhook**
N'importe qui peut POST sur `/api/stripe/webhook` sans signature.
`stripe.webhooks.constructEventAsync()` obligatoire.

**G3 : pas d'idempotence sur les webhooks**
Stripe peut delivrer le meme evenement plusieurs fois (retries).
Toujours verifier `stripe_webhook_events` avant de traiter.

**G4 : montants en euros au lieu de centimes**
`price: 99` → Stripe facture 0.99€. Utiliser `price: 9900` pour 99€.
PLANS toujours en centimes dans `lib/stripe/config.ts`.

**G5 : `invoice.subscription` de type `string | Stripe.Subscription`**
Le type Stripe est un union — peut etre un ID string ou un objet etendu.
Utiliser `as unknown as Stripe.Subscription` apres avoir verifie que c'est etendu.

**G6 : redirect apres checkout sans verifier le paiement**
`checkout.session.completed` ne garantit pas que le paiement est capture.
Verifier `session.payment_status === 'paid'` avant d'activer l'acces.

**G7 : oublier `maxDuration = 30` sur la route webhook**
Les webhooks Stripe peuvent timeout sur Vercel avec la limite par defaut de 10s.
Toujours `export const maxDuration = 30` dans la route.

## Voir aussi
- `references/webhook-events.md` — detail de chaque evenement et son handler
- `references/plan-mapping.md` — logique complete de synchronisation des plans
