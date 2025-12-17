import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/shared/lib/middleware'
import { db } from '@/shared/lib/db'

// GET /api/folders - Get all folders for the authenticated user
export const GET = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const folders = await db.folder.findMany({
      where: {
        userId,
        isArchived: false,
      },
      include: {
        documents: {
          where: {
            isArchived: false,
          },
          select: {
            id: true,
            title: true,
            icon: true,
            updatedAt: true,
          },
        },
        children: {
          where: {
            isArchived: false,
          },
          include: {
            _count: {
              select: {
                documents: {
                  where: {
                    isArchived: false,
                  },
                },
                children: {
                  where: {
                    isArchived: false,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            documents: {
              where: {
                isArchived: false,
              },
            },
            children: {
              where: {
                isArchived: false,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(folders)
  } catch (error) {
    console.error('Error fetching folders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch folders' },
      { status: 500 }
    )
  }
})

// POST /api/folders - Create a new folder
export const POST = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const { name, parentId, icon, color } = await req.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Folder name is required' },
        { status: 400 }
      )
    }

    const folder = await db.folder.create({
      data: {
        name,
        userId,
        parentId: parentId || null,
        icon: icon || '📁',
        color: color || null,
      },
      include: {
        documents: {
          where: {
            isArchived: false,
          },
          select: {
            id: true,
            title: true,
            icon: true,
            updatedAt: true,
          },
        },
        children: {
          where: {
            isArchived: false,
          },
          include: {
            _count: {
              select: {
                documents: {
                  where: {
                    isArchived: false,
                  },
                },
                children: {
                  where: {
                    isArchived: false,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            documents: {
              where: {
                isArchived: false,
              },
            },
            children: {
              where: {
                isArchived: false,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(folder, { status: 201 })
  } catch (error) {
    console.error('Error creating folder:', error)
    return NextResponse.json(
      { error: 'Failed to create folder' },
      { status: 500 }
    )
  }
})
