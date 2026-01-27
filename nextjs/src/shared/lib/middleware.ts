import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './auth'

export function withAuth(handler: (req: NextRequest, userId: string) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
    }

    // Get token from cookie
    const token = req.cookies.get('token')?.value
    
    if (!token) {
      const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      // Add CORS headers for error responses
      response.headers.set('Access-Control-Allow-Origin', '*')
      return response
    }

    const payload = verifyToken(token)
    if (!payload) {
      const response = NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      // Add CORS headers for error responses
      response.headers.set('Access-Control-Allow-Origin', '*')
      return response
    }

    const result = await handler(req, payload.userId)
    
    // Add CORS headers to successful responses
    result.headers.set('Access-Control-Allow-Origin', '*')
    result.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    result.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    return result
  }
}
