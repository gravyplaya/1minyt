export interface User {
  id: string
  name: string
  email: string
  roles: string[]
  stripeID?: string
  stripeSubscriptionId?: string
  stripeSubscriptionStatus?: string
  stripeSubscriptionCurrentPeriodEnd?: string
  createdAt: string
  updatedAt: string
}
