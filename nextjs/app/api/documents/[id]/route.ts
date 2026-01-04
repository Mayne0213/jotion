import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/shared/lib/middleware'
import { db } from '@/shared/lib/db'
import { deleteFile } from '@/shared/lib/s3'

// GET /api/documents/[id] - Get a specific document
export const GET = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    // Allow viewing both archived and non-archived documents
    const document = await db.document.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    )
  }
})

// PUT /api/documents/[id] - Update a specific document
export const PUT = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()
    const { title, content, icon, cover, isPublished } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    // Check if document exists and belongs to user
    const existingDocument = await db.document.findFirst({
      where: {
        id,
        userId,
        isArchived: false,
      },
    })

    if (!existingDocument) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    const document = await db.document.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(icon !== undefined && { icon }),
        ...(cover !== undefined && { cover }),
        ...(isPublished !== undefined && { isPublished }),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(document)
  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    )
  }
})

// Helper function to extract image paths from document content
async function extractImagePaths(content: any): Promise<string[]> {
  if (!content) return [];
  
  const paths: string[] = [];
  
  try {
    const parsed = typeof content === 'string' ? JSON.parse(content) : content;
    
    // Recursive function to traverse the document structure
    const traverse = (node: any) => {
      if (!node) return;
      
      // Check if this is an imageUpload node with a path
      if (node.type === 'imageUpload' && node.attrs?.path) {
        paths.push(node.attrs.path);
      }
      
      // Recursively check content and children
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(traverse);
      }
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(traverse);
      }
    };
    
    // Check if parsed is an object with content
    if (parsed.content) {
      traverse(parsed);
    } else if (Array.isArray(parsed)) {
      parsed.forEach(traverse);
    } else if (parsed.type) {
      traverse(parsed);
    }
  } catch (error) {
    console.error('Error parsing document content:', error);
  }
  
  return paths;
}

// DELETE /api/documents/[id] - Archive a specific document
export const DELETE = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

    // Check if document exists and belongs to user
    const existingDocument = await db.document.findFirst({
      where: {
        id,
        userId,
        isArchived: false,
      },
    })

    if (!existingDocument) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Extract and delete all image files from the document
    const imagePaths = await extractImagePaths(existingDocument.content);
    if (imagePaths.length > 0) {
      console.log(`Deleting ${imagePaths.length} image files from document ${id}`);
      
      // Delete all image files
      await Promise.allSettled(
        imagePaths.map(path => {
          try {
            return deleteFile(path);
          } catch (error) {
            console.error(`Failed to delete image file ${path}:`, error);
            return Promise.resolve();
          }
        })
      );
    }

    // Archive the document instead of deleting it
    const document = await db.document.update({
      where: { id },
      data: {
        isArchived: true,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ message: 'Document archived successfully' })
  } catch (error) {
    console.error('Error archiving document:', error)
    return NextResponse.json(
      { error: 'Failed to archive document' },
      { status: 500 }
    )
  }
})
