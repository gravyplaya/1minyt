import { Metadata } from 'next'
import { PricingTable } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Choose the perfect plan for your needs',
}

export default function Pricing() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
      <PricingTable />
    </div>
  )
}
