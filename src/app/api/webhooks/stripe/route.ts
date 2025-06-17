import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getPayloadClient } from '@/getPayload'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-08-01',
})

const webhookSecret = process.env.STRIPE_WEBHOOKS_ENDPOINT_SECRET

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const headersList = headers()
    const signature = headersList.get('stripe-signature')

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing stripe signature or webhook secret' },
        { status: 400 },
      )
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    console.log('Received Stripe webhook event:', event.type)

    const payload = await getPayloadClient()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Processing checkout session:', session.id)

        if (!session.customer || !session.subscription) {
          console.error('Missing customer or subscription in session:', session.id)
          return NextResponse.json({ error: 'Invalid session data' }, { status: 400 })
        }

        // Get the subscription details
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
        console.log('Retrieved subscription:', subscription.id)

        // Update the user with their Stripe customer ID and subscription details
        await payload.update({
          collection: 'users',
          where: {
            id: {
              equals: session.metadata?.userId,
            },
          },
          data: {
            stripeID: session.customer as string,
            stripeSubscriptionId: subscription.id,
            stripeSubscriptionStatus: subscription.status,
            stripeSubscriptionCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000,
            ).toISOString(),
          },
        })

        console.log('Updated user with Stripe details')
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('Processing subscription update:', subscription.id)

        if (!subscription.customer) {
          console.error('Missing customer in subscription:', subscription.id)
          return NextResponse.json({ error: 'Invalid subscription data' }, { status: 400 })
        }

        // Update the user's subscription status
        await payload.update({
          collection: 'users',
          where: {
            stripeID: {
              equals: subscription.customer as string,
            },
          },
          data: {
            stripeSubscriptionStatus: subscription.status,
            stripeSubscriptionCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000,
            ).toISOString(),
          },
        })

        console.log('Updated user subscription status')
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('Processing subscription deletion:', subscription.id)

        if (!subscription.customer) {
          console.error('Missing customer in subscription:', subscription.id)
          return NextResponse.json({ error: 'Invalid subscription data' }, { status: 400 })
        }

        // Update the user's subscription status to canceled
        await payload.update({
          collection: 'users',
          where: {
            stripeID: {
              equals: subscription.customer as string,
            },
          },
          data: {
            stripeSubscriptionStatus: 'canceled',
            stripeSubscriptionCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000,
            ).toISOString(),
          },
        })

        console.log('Updated user subscription status to canceled')
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
