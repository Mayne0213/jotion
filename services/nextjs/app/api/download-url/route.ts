import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_CONFIG, s3Client } from '@/shared/config/s3';

// 파일 다운로드 URL 생성
const generateDownloadUrl = async (fileKey: string): Promise<string> => {
  try {
    const command = new GetObjectCommand({
      Bucket: S3_CONFIG.BUCKET_NAME,
      Key: fileKey,
    });

    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return downloadUrl;
  } catch (error) {
    throw new Error('다운로드 URL 생성에 실패했습니다.');
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileKey } = body;

    if (!fileKey) {
      return NextResponse.json(
        { error: 'fileKey가 필요합니다.' },
        { status: 400 }
      );
    }

    const downloadUrl = await generateDownloadUrl(fileKey);

    return NextResponse.json({
      downloadUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '다운로드 URL 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}

