import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getMeUser } from '@/utilities/getMeUser'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-08-01',
})

export async function POST(req: Request) {
  try {
    const { priceId } = await req.json()

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 })
    }

    const { user } = await getMeUser({
      nullUserRedirect: undefined,
    })

    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/members/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/pricing`,
      metadata: {
        userId: user.id.toString(),
      },
      customer_creation: 'always',
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: 'Error creating checkout session' }, { status: 500 })
  }
}
