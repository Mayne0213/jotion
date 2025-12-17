import { parse } from 'node-html-parser';

export interface BookmarkMetadata {
  title?: string;
  description?: string;
  image?: string;
  url: string;
  domain?: string;
  author?: string;
}

function extractMetaContent(doc: any, property: string, name?: string): string {
  // Try Open Graph first
  let element = doc.querySelector(`meta[property="${property}"]`);
  if (element) {
    return element.getAttribute('content') || '';
  }

  // Try Twitter Card
  if (property.startsWith('og:')) {
    const twitterProperty = property.replace('og:', 'twitter:');
    element = doc.querySelector(`meta[name="${twitterProperty}"]`);
    if (element) {
      return element.getAttribute('content') || '';
    }
  }

  // Try standard meta name
  if (name) {
    element = doc.querySelector(`meta[name="${name}"]`);
    if (element) {
      return element.getAttribute('content') || '';
    }
  }

  return '';
}

function extractTitle(doc: any): string {
  // Try title tag first
  const titleElement = doc.querySelector('title');
  if (titleElement) {
    const title = titleElement.textContent?.trim();
    if (title && title.length > 0) {
      return title;
    }
  }

  // Try Open Graph title
  const ogTitle = extractMetaContent(doc, 'og:title');
  if (ogTitle) return ogTitle;

  // Try Twitter title
  const twitterTitle = extractMetaContent(doc, 'twitter:title');
  if (twitterTitle) return twitterTitle;

  return '';
}

function extractDescription(doc: any): string {
  // Try Open Graph description
  const ogDesc = extractMetaContent(doc, 'og:description');
  if (ogDesc) return ogDesc;

  // Try Twitter description
  const twitterDesc = extractMetaContent(doc, 'twitter:description');
  if (twitterDesc) return twitterDesc;

  // Try standard meta description
  const metaDesc = extractMetaContent(doc, 'description');
  if (metaDesc) return metaDesc;

  return '';
}

function extractImage(doc: any, baseUrl: string): string {
  // Try Open Graph image
  let image = extractMetaContent(doc, 'og:image');
  if (image) {
    // Convert relative URLs to absolute
    if (image.startsWith('//')) {
      image = 'https:' + image;
    } else if (image.startsWith('/')) {
      image = new URL(image, baseUrl).toString();
    }
    return image;
  }

  // Try Twitter image
  image = extractMetaContent(doc, 'twitter:image');
  if (image) {
    // Convert relative URLs to absolute
    if (image.startsWith('//')) {
      image = 'https:' + image;
    } else if (image.startsWith('/')) {
      image = new URL(image, baseUrl).toString();
    }
    return image;
  }

  return '';
}

function extractAuthor(doc: any): string {
  // Try Open Graph site_name as author fallback
  const siteName = extractMetaContent(doc, 'og:site_name');
  if (siteName) return siteName;

  // Try author meta
  const author = extractMetaContent(doc, 'author');
  if (author) return author;

  return '';
}

export async function extractBookmarkMetadata(url: string): Promise<BookmarkMetadata> {
  try {
    console.log('Extracting metadata for URL:', url);
    
    // Validate URL
    new URL(url);
    
    // Fetch the webpage
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Jotion/1.0; +https://jotion.com)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    console.log('HTML length:', html.length);
    
    const doc = parse(html);

    // Extract metadata
    const title = extractTitle(doc);
    const description = extractDescription(doc);
    const image = extractImage(doc, url);
    const author = extractAuthor(doc);

    // Extract domain from URL
    const domain = new URL(url).hostname;

    const metadata = {
      title: title || '',
      description: description || '',
      image: image || '',
      url,
      domain,
      author: author || '',
    };

    console.log('Extracted metadata:', metadata);
    return metadata;
  } catch (error) {
    console.error('Error extracting bookmark metadata:', error);
    
    // Return basic info even if metadata extraction fails
    const domain = new URL(url).hostname;
    return {
      title: '',
      description: '',
      image: '',
      url,
      domain,
      author: '',
    };
  }
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
