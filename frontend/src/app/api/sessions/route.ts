import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { CreateSessionSchema } from '@/lib/validators'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = CreateSessionSchema.parse(body)

    // Python バックエンドへプロキシ
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/v1/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': crypto.randomUUID(),
      },
      body: JSON.stringify(validated),
      cache: 'no-store',
    })

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
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: '入力内容に誤りがあります',
            details: error.errors,
          },
        },
        { status: 400 }
      )
    }

    console.error('Session creation error:', error)
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
