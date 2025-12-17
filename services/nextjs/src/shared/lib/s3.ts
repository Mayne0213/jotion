import { DeleteObjectCommand, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_CONFIG, s3Client } from '@/shared/config/s3';

/**
 * Upload a file to S3 (Server-side)
 * @param file - The file to upload (File or Buffer)
 * @param folder - The folder path (e.g., 'images', 'audio', 'documents')
 * @returns The public URL and key of the uploaded file
 */
export async function uploadFileServer(
  file: File | Buffer,
  fileName: string,
  fileType: string,
  folder: 'images' | 'audio' | 'documents' = 'documents'
): Promise<{ url: string; path: string }> {
  try {
    const fileExt = fileName.split('.').pop();
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const fileKey = `jotion-uploads/${folder}/${uniqueFileName}`;

    // Convert File to Buffer if needed
    let fileBuffer: Buffer;
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
    } else {
      fileBuffer = file;
    }

    // Upload directly to S3
    const command = new PutObjectCommand({
      Bucket: S3_CONFIG.BUCKET_NAME,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: fileType,
    });

    await s3Client.send(command);

    // Return the public URL
    const publicUrl = `${S3_CONFIG.BUCKET_URL}/${fileKey}`;

    return {
      url: publicUrl,
      path: fileKey,
    };
  } catch (error: any) {
    console.error('S3 upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

/**
 * Upload a file to S3 (Client-side using presigned URL)
 * @param file - The file to upload
 * @param folder - The folder path (e.g., 'images', 'audio', 'documents')
 * @returns The public URL and key of the uploaded file
 */
export async function uploadFile(
  file: File,
  folder: 'images' | 'audio' | 'documents' = 'documents'
): Promise<{ url: string; path: string }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const fileKey = `jotion-uploads/${folder}/${fileName}`;

    // Get upload URL
    const uploadUrlResponse = await fetch('/api/upload-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName,
        fileType: file.type,
        folder: `jotion-uploads/${folder}`,
      }),
    });

    if (!uploadUrlResponse.ok) {
      throw new Error('Failed to get upload URL');
    }

    const { uploadUrl, fileKey: returnedFileKey } = await uploadUrlResponse.json();
    const finalFileKey = returnedFileKey || fileKey;

    // Upload to S3 using presigned URL
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file: ${uploadResponse.statusText}`);
    }

    // Return the public URL
    const publicUrl = `${S3_CONFIG.BUCKET_URL}/${finalFileKey}`;

    return {
      url: publicUrl,
      path: finalFileKey,
    };
  } catch (error: any) {
    console.error('S3 upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

/**
 * Delete a file from S3
 * @param path - The file key to delete
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: S3_CONFIG.BUCKET_NAME,
      Key: path,
    });

    await s3Client.send(command);
  } catch (error: any) {
    console.error('S3 delete error:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

/**
 * Get public URL for a file in S3
 * @param path - The file key
 * @returns The public URL
 */
export function getFileUrl(path: string): string {
  return `${S3_CONFIG.BUCKET_URL}/${path}`;
}

/**
 * Get signed download URL for a file in S3
 * @param path - The file key
 * @returns The signed download URL
 */
export async function getDownloadUrl(path: string): Promise<string> {
  try {
    const response = await fetch('/api/download-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileKey: path }),
    });

    if (!response.ok) {
      throw new Error('Failed to get download URL');
    }

    const { downloadUrl } = await response.json();
    return downloadUrl;
  } catch (error: any) {
    console.error('Failed to get download URL:', error);
    throw new Error(`Failed to get download URL: ${error.message}`);
  }
}

