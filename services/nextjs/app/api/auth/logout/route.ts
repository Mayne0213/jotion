import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({
      message: 'Logout successful',
    })

    // Clear auth token cookie
    response.cookies.delete('auth-token')

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

