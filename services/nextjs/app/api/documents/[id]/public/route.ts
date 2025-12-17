import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/shared/lib/db'

// GET /api/documents/[id]/public - Get a public document (no auth required)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/')[3] // Extract ID from /api/documents/[id]/public

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    // 공개된 문서만 조회 (인증 없이)
    const document = await db.document.findFirst({
      where: {
        id,
        isPublished: true, // 공개된 문서만
        isArchived: false,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found or not published' },
        { status: 404 }
      )
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error('Error fetching public document:', error)
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    )
  }
}
