import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/getPayload'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    const user = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (!user.docs || user.docs.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userId = user.docs[0]?.id
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 404 })
    }

    const updatedUser = await payload.update({
      collection: 'users',
      id: userId,
      data: {
        roles: ['admin'],
      },
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 })
  }
}
