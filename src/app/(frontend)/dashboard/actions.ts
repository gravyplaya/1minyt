'use server'

import { getPayloadClient } from '@/getPayload'
import { User } from '@/payload-types'

export async function updateProfile(data: Partial<User>) {
  const payload = await getPayloadClient()
  const { user } = await payload.getMe()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const updatedUser = await payload.update({
    collection: 'users',
    id: user.id,
    data,
  })

  return updatedUser
}
