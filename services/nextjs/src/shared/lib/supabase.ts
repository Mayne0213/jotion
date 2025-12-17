import { createClient } from '@supabase/supabase-js';

// Support both server-side and client-side environment variables
const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.SUPABASE_URL || 
  '';

const supabaseAnonKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.SUPABASE_ANON_KEY || 
  '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are not set. Please set SUPABASE_URL and SUPABASE_ANON_KEY (or NEXT_PUBLIC_* variants) in your environment variables.');
  console.warn('Current values:', {
    supabaseUrl: supabaseUrl ? 'set' : 'not set',
    supabaseAnonKey: supabaseAnonKey ? 'set' : 'not set',
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client with service role (bypasses RLS)
// NEVER expose this to the client!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Storage bucket name for file uploads
export const STORAGE_BUCKET = 'jotion-files';

/**
 * Upload a file to Supabase Storage
 * @param file - The file to upload
 * @param folder - The folder path (e.g., 'images', 'audio', 'documents')
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  folder: 'images' | 'audio' | 'documents' = 'documents'
): Promise<{ url: string; path: string }> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  // Use admin client to bypass RLS, fallback to regular client
  const client = supabaseAdmin || supabase;

  const { data, error } = await client.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  const { data: { publicUrl } } = client.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return {
    url: publicUrl,
    path: filePath,
  };
}

/**
 * Delete a file from Supabase Storage
 * @param path - The file path to delete
 */
export async function deleteFile(path: string): Promise<void> {
  // Use admin client to bypass RLS, fallback to regular client
  const client = supabaseAdmin || supabase;
  
  const { error } = await client.storage
    .from(STORAGE_BUCKET)
    .remove([path]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

