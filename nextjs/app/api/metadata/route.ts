import { NextRequest, NextResponse } from 'next/server';
import { extractBookmarkMetadata } from '@/shared/lib/metadata-extractor';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const metadata = await extractBookmarkMetadata(url);
    
    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error in metadata API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metadata' }, 
      { status: 500 }
    );
  }
}
