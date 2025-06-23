import type { CollectionConfig } from 'payload'
import type { User } from './types'

import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req: { user } }) => {
      // Only allow admin users to access the admin panel
      return Boolean(
        user?.collection === 'users' && (user as unknown as User)?.roles?.includes('admin'),
      )
    },
    create: anyone,
    delete: ({ req: { user } }) => {
      // Only allow admins to delete users
      return Boolean(
        user?.collection === 'users' && (user as unknown as User)?.roles?.includes('admin'),
      )
    },
    read: authenticated,
    update: ({ req: { user } }) => {
      // Users can update their own data, admins can update any user
      if (user?.collection === 'users' && (user as unknown as User)?.roles?.includes('admin'))
        return true
      return {
        id: {
          equals: user?.id,
        },
      }
    },
  },
  admin: {
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['user'],
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'stripeID',
      type: 'text',
      admin: {
        readOnly: true,
      },
      dbName: 'stripe_id',
    },
    {
      name: 'stripeSubscriptionId',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'stripeSubscriptionStatus',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Canceled', value: 'canceled' },
        { label: 'Incomplete', value: 'incomplete' },
        { label: 'Incomplete Expired', value: 'incomplete_expired' },
        { label: 'Past Due', value: 'past_due' },
        { label: 'Trialing', value: 'trialing' },
        { label: 'Unpaid', value: 'unpaid' },
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'stripeSubscriptionCurrentPeriodEnd',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
