'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ManageBillingButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleManageBilling = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create portal session')
      }

      const { url } = await response.json()
      router.push(url)
    } catch (error) {
      console.error('Error creating portal session:', error)
      alert('Failed to create billing portal session. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleManageBilling}
      disabled={loading}
      className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Loading...' : 'Manage Billing'}
    </button>
  )
}
