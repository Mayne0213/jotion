import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/shared/lib/middleware'
import { db } from '@/shared/lib/db'

// GET /api/folders/[id] - Get a specific folder
export const GET = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json(
        { error: 'Folder ID is required' },
        { status: 400 }
      )
    }

    const folder = await db.folder.findFirst({
      where: {
        id,
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
          orderBy: {
            updatedAt: 'desc',
          },
        },
        children: {
          where: {
            isArchived: false,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        parent: {
          select: {
            id: true,
            name: true,
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

    if (!folder) {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(folder)
  } catch (error) {
    console.error('Error fetching folder:', error)
    return NextResponse.json(
      { error: 'Failed to fetch folder' },
      { status: 500 }
    )
  }
})

// PUT /api/folders/[id] - Update a specific folder
export const PUT = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()
    const { name, parentId, icon, color } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Folder ID is required' },
        { status: 400 }
      )
    }

    // Check if folder exists and belongs to user
    const existingFolder = await db.folder.findFirst({
      where: {
        id,
        userId,
        isArchived: false,
      },
    })

    if (!existingFolder) {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: 404 }
      )
    }

    const folder = await db.folder.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(parentId !== undefined && { parentId: parentId || null }),
        ...(icon !== undefined && { icon }),
        ...(color !== undefined && { color }),
        updatedAt: new Date(),
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
          orderBy: {
            updatedAt: 'desc',
          },
        },
        children: {
          where: {
            isArchived: false,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        parent: {
          select: {
            id: true,
            name: true,
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

    return NextResponse.json(folder)
  } catch (error) {
    console.error('Error updating folder:', error)
    return NextResponse.json(
      { error: 'Failed to update folder' },
      { status: 500 }
    )
  }
})

// DELETE /api/folders/[id] - Archive a specific folder
export const DELETE = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json(
        { error: 'Folder ID is required' },
        { status: 400 }
      )
    }

    // Check if folder exists and belongs to user
    const existingFolder = await db.folder.findFirst({
      where: {
        id,
        userId,
        isArchived: false,
      },
    })

    if (!existingFolder) {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: 404 }
      )
    }

    // Recursively archive the folder and all its contents
    const archiveFolderRecursively = async (folderId: string, tx: any) => {
      // Archive all documents in this folder
      await tx.document.updateMany({
        where: {
          folderId: folderId,
          isArchived: false,
        },
        data: {
          isArchived: true,
          updatedAt: new Date(),
        },
      })

      // Get all child folders
      const childFolders = await tx.folder.findMany({
        where: {
          parentId: folderId,
          isArchived: false,
        },
        select: {
          id: true,
        },
      })

      // Recursively archive all child folders
      for (const childFolder of childFolders) {
        await archiveFolderRecursively(childFolder.id, tx)
      }

      // Archive this folder
      await tx.folder.update({
        where: { id: folderId },
        data: {
          isArchived: true,
          updatedAt: new Date(),
        },
      })
    }

    // Archive the folder and all its contents
    await db.$transaction(async (tx) => {
      await archiveFolderRecursively(id, tx)
    })

    return NextResponse.json({ message: 'Folder archived successfully' })
  } catch (error) {
    console.error('Error archiving folder:', error)
    return NextResponse.json(
      { error: 'Failed to archive folder' },
      { status: 500 }
    )
  }
})
