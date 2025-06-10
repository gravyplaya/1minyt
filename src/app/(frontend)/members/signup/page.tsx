import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { getMeUser } from '@/utilities/getMeUser'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new account',
}

export default async function SignUp() {
  const { user } = await getMeUser({
    validUserRedirect: '/members/dashboard',
  })

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto  rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Sign Up</h1>
        <form action="/api/users" method="POST" className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/members/login" className="text-blue-600 hover:text-blue-800">
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  )
}
