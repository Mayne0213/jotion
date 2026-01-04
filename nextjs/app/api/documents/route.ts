import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/shared/lib/middleware'
import { db } from '@/shared/lib/db'

// GET /api/documents - Get all documents for the authenticated user
export const GET = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const url = new URL(req.url)
    const folderId = url.searchParams.get('folderId')

    const documents = await db.document.findMany({
      where: {
        userId,
        isArchived: false,
        ...(folderId && { folderId }),
      },
      include: {
        folder: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
})

// POST /api/documents - Create a new document
export const POST = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const { title, parentId, folderId } = await req.json()

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const document = await db.document.create({
      data: {
        title,
        userId,
        parentId: parentId || null,
        folderId: folderId || null,
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Start writing...',
                },
              ],
            },
          ],
        },
      },
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    )
  }
})
