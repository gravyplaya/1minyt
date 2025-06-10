import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()

  // 1. Forward to external API
  const externalRes = await fetch('https://n8n.tavonni.com/webhook/1minyt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  // 2. Optionally, forward to Payload's built-in API
  const payloadRes = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/payload/form-submissions`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  )

  // 3. Return a response to the frontend
  if (!externalRes.ok) {
    return NextResponse.json({ error: 'Failed to send to external API' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
