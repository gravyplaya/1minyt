import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { query, userId } = await request.json()

    const response = await fetch('https://n8n.tavonni.com/webhook/1minyt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, userId }),
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error processing search request:', error)
    return NextResponse.json({ error: 'Failed to process search request' }, { status: 500 })
  }
}
