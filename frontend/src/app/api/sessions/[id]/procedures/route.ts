import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: sessionId } = await params
    const { searchParams } = new URL(request.url)

    const query = new URLSearchParams()
    if (searchParams.has('category')) query.append('category', searchParams.get('category')!)
    if (searchParams.has('priority')) query.append('priority', searchParams.get('priority')!)
    if (searchParams.has('completed')) query.append('completed', searchParams.get('completed')!)

    const queryString = query.toString()
    const url = `${process.env.BACKEND_API_URL}/api/v1/sessions/${sessionId}/procedures${
      queryString ? `?${queryString}` : ''
    }`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': crypto.randomUUID(),
      },
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
    return NextResponse.json(data)
  } catch (error) {
    console.error('Get procedures error:', error)
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

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: sessionId } = await params

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/v1/sessions/${sessionId}/procedures`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': crypto.randomUUID(),
        },
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
    console.error('Generate procedures error:', error)
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
