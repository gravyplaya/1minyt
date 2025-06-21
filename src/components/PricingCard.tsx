'use client'

import type Stripe from 'stripe'
import { useState } from 'react'

interface PricingCardProps {
  product: Stripe.Product
  price: Stripe.Price | null
}

export function PricingCard({ product, price }: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    if (!price) {
      alert('Price information is not available')
      return
    }

    try {
      setIsLoading(true)

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: price.id,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.url) {
        throw new Error('No checkout URL returned')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!price) {
    return (
      <div className="border rounded-lg p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
        <p className="text-gray-600 mb-6">{product.description}</p>
        <div className="mb-6">
          <span className="text-4xl font-bold">Price not available</span>
        </div>
        <button
          className="w-full bg-gray-300 text-gray-600 py-3 px-6 rounded-lg cursor-not-allowed"
          disabled
        >
          Unavailable
        </button>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
      <p className="text-gray-600 mb-6">{product.description}</p>

      <div className="mb-6">
        <span className="text-4xl font-bold">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: price.currency,
          }).format((price.unit_amount || 0) / 100)}
        </span>
        {price.recurring && <span className="text-gray-600">/{price.recurring.interval}</span>}
      </div>

      <button
        className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleCheckout}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Get Started'}
      </button>
    </div>
  )
}
