import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { message, userId, transcript, summary } = await request.json()

    // Call the external AI service
    const response = await fetch(
      'https://n8n.tavonni.com/webhook/54adad26-df1d-4586-b49f-cd6b56f7f3b7/chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${process.env.CHAT_USER}:${process.env.CHAT_PASS}`)}`,
        },
        body: JSON.stringify({
          message,
          userId,
          transcript,
          summary,
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error processing chat request:', error)
    return NextResponse.json({ error: 'Failed to process chat request' }, { status: 500 })
  }
}
