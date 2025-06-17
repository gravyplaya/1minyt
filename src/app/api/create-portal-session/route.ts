import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getPayloadClient } from '@/getPayload'
import { getMeUser } from '@/utilities/getMeUser'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-08-01',
})

export async function POST(req: Request) {
  try {
    const { user } = await getMeUser({
      nullUserRedirect: undefined,
    })

    if (!user) {
      console.error('No user found in session')
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    if (!user.stripeID) {
      console.error('No Stripe customer ID found for user:', user.id)
      return NextResponse.json({ error: 'No Stripe customer ID found' }, { status: 400 })
    }

    if (!process.env.NEXT_PUBLIC_SERVER_URL) {
      console.error('NEXT_PUBLIC_SERVER_URL is not set')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    try {
      // Verify the customer exists in Stripe
      const customer = await stripe.customers.retrieve(user.stripeID)
      if (customer.deleted) {
        console.error('Customer was deleted in Stripe:', user.stripeID)
        return NextResponse.json({ error: 'Invalid Stripe customer' }, { status: 400 })
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeID,
        return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/members/dashboard`,
      })

      if (!session?.url) {
        console.error('No URL returned from Stripe portal session creation')
        return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 })
      }

      return NextResponse.json({ url: session.url })
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        console.error('Stripe error:', error.message)
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
      throw error
    }
  } catch (error) {
    console.error('Error creating portal session:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error creating portal session' },
      { status: 500 },
    )
  }
}
