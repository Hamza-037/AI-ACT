import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe, syncPlanFromStripe } from '@/lib/stripe/sync'
import { getServiceRoleClient } from '@/lib/supabase/service'
import { PRICE_TO_PLAN } from '@/lib/stripe/config'

export const maxDuration = 30

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

export async function POST(req: NextRequest): Promise<NextResponse> {
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    const body = await req.text()
    const stripe = getStripe()
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getServiceRoleClient() as unknown as any

  // Vérification idempotence
  const { data: existing } = (await supabase
    .from('stripe_webhook_events')
    .select('id')
    .eq('id', event.id)
    .single()) as { data: AnyRecord | null }

  if (existing) {
    return NextResponse.json({ received: true })
  }

  // Enregistrement pour idempotence
  await supabase.from('stripe_webhook_events').insert({ id: event.id, type: event.type })

  // Traitement des événements
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const customerId =
      typeof session.customer === 'string' ? session.customer : (session.customer?.id ?? '')
    if (session.mode === 'subscription' && session.subscription) {
      const subscriptionId =
        typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription.id
      const stripe = getStripe()
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const priceId = subscription.items.data[0]?.price.id ?? ''
      const plan = PRICE_TO_PLAN[priceId] ?? 'gratuit'
      await syncPlanFromStripe(customerId, plan)
      await supabase
        .from('organizations')
        .update({ stripe_subscription_id: subscriptionId })
        .eq('stripe_customer_id', customerId)
    }
  }

  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice
    const billingReason = invoice.billing_reason
    if (billingReason === 'subscription_create' || billingReason === 'subscription_cycle') {
      const customerId =
        typeof invoice.customer === 'string' ? invoice.customer : (invoice.customer?.id ?? '')
      const rawSub = (invoice as unknown as { subscription: string | { id: string } | null }).subscription
      const subscriptionId =
        typeof rawSub === 'string' ? rawSub : (rawSub?.id ?? '')
      if (subscriptionId) {
        const stripe = getStripe()
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const priceId = subscription.items.data[0]?.price.id ?? ''
        const plan = PRICE_TO_PLAN[priceId] ?? 'gratuit'
        await syncPlanFromStripe(customerId, plan)
      }
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription
    const customerId =
      typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer.id
    const priceId = subscription.items.data[0]?.price.id ?? ''
    const plan = PRICE_TO_PLAN[priceId] ?? 'gratuit'
    await syncPlanFromStripe(customerId, plan)
    await supabase
      .from('organizations')
      .update({ stripe_subscription_id: subscription.id })
      .eq('stripe_customer_id', customerId)
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const customerId =
      typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer.id
    await syncPlanFromStripe(customerId, 'gratuit')
    await supabase
      .from('organizations')
      .update({ stripe_subscription_id: null })
      .eq('stripe_customer_id', customerId)
  }

  return NextResponse.json({ received: true })
}
