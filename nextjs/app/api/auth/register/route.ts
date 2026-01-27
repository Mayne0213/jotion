import { NextRequest, NextResponse } from 'next/server'
import { createUser, generateToken } from '@/shared/lib/auth'
import { db } from '@/shared/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { username, password, name } = await req.json()

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { username },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      )
    }

    // Create user
    const user = await createUser(username, password, name)

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      username: user.username,
    })

    // Create response with user data
    const response = NextResponse.json(
      {
        message: 'User created successfully',
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
        }
      },
      { status: 201 }
    )

    // Set auth token in cookie (HttpOnly for security)
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
