import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Use Payload's internal API directly instead of making an external HTTP request
    const payload = await getPayload({ config })

    // Create the form submission directly using Payload's API
    const result = await payload.create({
      collection: 'form-submissions',
      data: body,
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Form submission error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
