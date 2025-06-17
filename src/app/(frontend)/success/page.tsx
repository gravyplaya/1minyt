import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Payment Successful',
  description: 'Thank you for your purchase',
}

async function getSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return session
  } catch (error) {
    console.error('Error retrieving session:', error)
    return null
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  if (!searchParams.session_id) {
    return notFound()
  }

  const session = await getSession(searchParams.session_id)

  if (!session) {
    return notFound()
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your purchase. Your subscription has been activated.
          </p>
        </div>

        <div className="bg-gray-500 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="space-y-2 text-left">
            <p>
              <span className="font-medium">Order ID:</span> {session.id}
            </p>
            <p>
              <span className="font-medium">Amount Paid:</span>{' '}
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: session.currency?.toUpperCase() || 'USD',
              }).format((session.amount_total || 0) / 100)}
            </p>
            <p>
              <span className="font-medium">Status:</span>{' '}
              <span className="capitalize">{session.status}</span>
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            href="/members"
            className="inline-block bg-black text-white py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Return to Home
          </Link>
          <p className="text-sm text-gray-500">
            A confirmation email has been sent to your email address.
          </p>
        </div>
      </div>
    </div>
  )
}
