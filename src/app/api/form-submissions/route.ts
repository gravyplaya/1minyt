import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!process.env.NEXT_PUBLIC_SERVER_URL) {
      console.error('NEXT_PUBLIC_SERVER_URL is not set')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Forward to Payload's built-in API with a timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    try {
      const payloadRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/form-submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
        cache: 'no-store',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!payloadRes.ok) {
        const errorData = await payloadRes.json()
        console.error('Payload API error:', errorData)
        return NextResponse.json(
          {
            error: 'Failed to save form submission',
            details: errorData,
          },
          { status: payloadRes.status },
        )
      }

      const payloadData = await payloadRes.json()
      return NextResponse.json({ success: true, data: payloadData })
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Form submission timed out')
        return NextResponse.json(
          { error: 'Form submission timed out. Please try again.' },
          { status: 408 },
        )
      }
      throw error
    }
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
