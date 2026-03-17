import { NextRequest, NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase/service'
import { getPlanFromPriceId } from '@/lib/stripe/sync'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

type StripeEvent = {
  id: string
  type: string
  data: { object: AnyRecord }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: StripeEvent
  try {
    // TODO: vérifier la signature avec stripe.webhooks.constructEventAsync
    event = (await req.json()) as StripeEvent
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getServiceRoleClient() as unknown as any

  // Idempotence check
  const { data: existing } = await supabase
    .from('stripe_webhook_events')
    .select('id')
    .eq('id', event.id)
    .single() as { data: AnyRecord | null }

  if (existing) {
    return NextResponse.json({ received: true })
  }

  // Enregistrer l'événement
  await supabase
    .from('stripe_webhook_events')
    .insert({ id: event.id, type: event.type })

  // Traiter l'événement
  if (
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated'
  ) {
    const subscription = event.data.object
    const customerId = subscription.customer as string
    const priceId = (
      (subscription.items as { data: { price: { id: string } }[] }).data[0]?.price.id ?? ''
    )
    const plan = getPlanFromPriceId(priceId)

    await supabase
      .from('organizations')
      .update({
        plan,
        stripe_subscription_id: subscription.id as string,
      })
      .eq('stripe_customer_id', customerId)
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    const customerId = subscription.customer as string

    await supabase
      .from('organizations')
      .update({ plan: 'gratuit', stripe_subscription_id: null })
      .eq('stripe_customer_id', customerId)
  }

  return NextResponse.json({ received: true })
}
