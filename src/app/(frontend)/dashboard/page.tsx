/* eslint-disable @typescript-eslint/no-unused-vars */
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/getPayload'
import { User } from '@/payload-types'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import ManageBillingButton from './ManageBillingButton'
import { ProfileForm } from './ProfileForm'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Welcome to your dashboard',
}

async function getUser(): Promise<User | null> {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({
    headers: {
      append: function (name: string, value: string): void {
        throw new Error('Function not implemented.')
      },
      delete: function (name: string): void {
        throw new Error('Function not implemented.')
      },
      get: function (name: string): string | null {
        throw new Error('Function not implemented.')
      },
      getSetCookie: function (): string[] {
        throw new Error('Function not implemented.')
      },
      has: function (name: string): boolean {
        throw new Error('Function not implemented.')
      },
      set: function (name: string, value: string): void {
        throw new Error('Function not implemented.')
      },
      forEach: function (
        callbackfn: (value: string, key: string, parent: Headers) => void,
        thisArg?: any,
      ): void {
        throw new Error('Function not implemented.')
      },
      entries: function (): HeadersIterator<[string, string]> {
        throw new Error('Function not implemented.')
      },
      keys: function (): HeadersIterator<string> {
        throw new Error('Function not implemented.')
      },
      values: function (): HeadersIterator<string> {
        throw new Error('Function not implemented.')
      },
      [Symbol.iterator]: function (): HeadersIterator<[string, string]> {
        throw new Error('Function not implemented.')
      },
    },
  })

  // Type guard to ensure user is a User and not a Submission
  if (user && 'collection' in user && user.collection === 'users') {
    return user as User
  }

  return null
}

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    return notFound()
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Welcome to your Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} />
            </CardContent>
          </Card>

          {/* Subscription Section */}
          <Card>
            <CardHeader>
              <CardTitle>Your Subscription</CardTitle>
              <CardDescription>Manage your subscription and billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{user.stripeSubscriptionStatus}</p>
              </div>
              {user.stripeSubscriptionCurrentPeriodEnd && (
                <div>
                  <p className="text-muted-foreground">Next billing date</p>
                  <p className="font-medium">
                    {new Date(user.stripeSubscriptionCurrentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <ManageBillingButton />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
