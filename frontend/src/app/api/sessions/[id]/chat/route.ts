import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: sessionId } = await params
    const body = await request.json()

    if (!body.message || typeof body.message !== 'string' || body.message.length > 500) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'メッセージは1〜500文字で入力してください',
          },
        },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/v1/sessions/${sessionId}/chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': crypto.randomUUID(),
        },
        body: JSON.stringify({ message: body.message }),
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        {
          error: {
            code: errorData.error?.code || 'INTERNAL_SERVER_ERROR',
            message: errorData.error?.message || 'システムエラーが発生しました',
          },
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'システムエラーが発生しました',
        },
      },
      { status: 500 }
    )
  }
}
