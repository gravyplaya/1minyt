import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { getMeUser } from '@/utilities/getMeUser'
import LogoutButton from './LogoutButton'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Member dashboard',
}

export default async function Dashboard() {
  const { user } = await getMeUser({
    nullUserRedirect: '/members/login',
  })

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome, {user.name}!</h1>
        <div className="space-y-6">
          <div className="p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  )
}
