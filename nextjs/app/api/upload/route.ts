import { NextRequest, NextResponse } from 'next/server';
import { uploadFileServer, deleteFile } from '@/shared/lib/s3';
import { cookies } from 'next/headers';
import { verifyToken } from '@/shared/lib/auth';

// File size limits (in bytes)
const MAX_FILE_SIZE = {
  image: 10 * 1024 * 1024, // 10MB
  audio: 50 * 1024 * 1024, // 50MB
  document: 20 * 1024 * 1024, // 20MB
};

// Allowed file types
const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/webm'],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
  ],
};

export async function POST(request: NextRequest) {
  try {
    // Verify authentication - check cookie
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('auth-token')?.value;
    
    const token = cookieToken;

    if (!token) {
      console.error('[Upload] No token found in Authorization header or cookie');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.error('[Upload] Token verification failed');
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    console.log('[Upload] Token verified successfully for user:', decoded.userId);

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('type') as 'images' | 'audio' | 'documents';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Determine folder based on file type
    let folder: 'images' | 'audio' | 'documents' = 'documents';
    let maxSize = MAX_FILE_SIZE.document;
    let allowedTypes = ALLOWED_TYPES.document;

    if (fileType === 'images') {
      folder = 'images';
      maxSize = MAX_FILE_SIZE.image;
      allowedTypes = ALLOWED_TYPES.image;
    } else if (fileType === 'audio') {
      folder = 'audio';
      maxSize = MAX_FILE_SIZE.audio;
      allowedTypes = ALLOWED_TYPES.audio;
    } else if (file.type.startsWith('image/')) {
      folder = 'images';
      maxSize = MAX_FILE_SIZE.image;
      allowedTypes = ALLOWED_TYPES.image;
    } else if (file.type.startsWith('audio/')) {
      folder = 'audio';
      maxSize = MAX_FILE_SIZE.audio;
      allowedTypes = ALLOWED_TYPES.audio;
    }

    // Validate file size
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds maximum limit of ${maxSize / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} is not allowed` },
        { status: 400 }
      );
    }

    // Upload file to S3
    const { url, path } = await uploadFileServer(file, file.name, file.type, folder);

    return NextResponse.json({
      success: true,
      url,
      path,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// DELETE /api/upload - Delete a file from storage
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('auth-token')?.value;
    
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : cookieToken;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    // Delete file from S3
    await deleteFile(filePath);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Delete file error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete file' },
      { status: 500 }
    );
  }
}

