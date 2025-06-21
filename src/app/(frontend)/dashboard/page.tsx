import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/getPayload'
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

async function getUser() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'users',
    where: {
      id: {
        equals: 'me',
      },
    },
  })
  return docs[0]
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
