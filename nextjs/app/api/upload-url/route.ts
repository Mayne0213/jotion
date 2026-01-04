import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_CONFIG, s3Client } from '@/shared/config/s3';

// 파일 업로드 URL 생성
const generateUploadUrl = async (
  fileName: string,
  fileType: string,
  folder?: string
): Promise<{ uploadUrl: string; fileKey: string }> => {
  try {
    const fileKey = folder ? `${folder}/${Date.now()}-${fileName}` : `${Date.now()}-${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: S3_CONFIG.BUCKET_NAME,
      Key: fileKey,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return {
      uploadUrl,
      fileKey,
    };
  } catch (error: any) {
    throw new Error(`업로드 URL 생성에 실패했습니다: ${error.message}`);
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, fileType, folder } = body;

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'fileName과 fileType이 필요합니다.' },
        { status: 400 }
      );
    }

    const { uploadUrl, fileKey } = await generateUploadUrl(fileName, fileType, folder || 'jotion-uploads');

    return NextResponse.json({
      uploadUrl,
      fileKey,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '업로드 URL 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}

