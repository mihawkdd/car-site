import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'autont-storage-key',
    storage: window.localStorage
  },
  global: {
    headers: {
      'Cache-Control': 'no-cache'
    }
  },
  db: {
    schema: 'public'
  }
});

// Admin token matching the one in RLS policies
const ADMIN_TOKEN = 'nt12gcw';

export function withAdminToken<T extends object>(data: T): T & { admin_token: string } {
  return {
    ...data,
    admin_token: ADMIN_TOKEN
  };
}

export function getResponsiveImageUrl(url: string, width = 800) {
  if (!url) return { src: '', srcSet: '' };

  // Generate multiple sizes for responsive images
  const sizes = [400, 800, 1200];
  const baseUrl = url.split('?')[0];
  
  const srcSet = sizes
    .map(size => {
      const optimizedUrl = `${baseUrl}?width=${size}&quality=80&format=webp`;
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');

  // Default src uses WebP format
  const src = `${baseUrl}?width=${width}&quality=80&format=webp`;

  return { src, srcSet };
}

// Retry mechanism for Supabase queries
export async function retryableQuery<T>(
  queryFn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await queryFn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
}

export async function uploadImage(file: File): Promise<string> {
  try {
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload only image files.');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size should be less than 5MB.');
    }

    const timestamp = new Date().getTime();
    const random = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${random}.${fileExt}`;

    const { data, error: uploadError } = await supabase.storage
      .from('car-images')
      .upload(fileName, file, {
        cacheControl: '31536000',
        upsert: false,
        contentType: file.type,
        headers: {
          'x-admin-token': ADMIN_TOKEN
        }
      });

    if (uploadError) {
      console.error('Error uploading to storage:', uploadError);
      throw new Error(uploadError.message);
    }

    if (!data?.path) {
      throw new Error('Upload failed - no path returned');
    }

    const { data: { publicUrl } } = supabase.storage
      .from('car-images')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function uploadVideo(file: File): Promise<string> {
  try {
    if (!file.type.startsWith('video/')) {
      throw new Error('Please upload only video files.');
    }

    if (file.size > 50 * 1024 * 1024) {
      throw new Error('Video size should be less than 50MB.');
    }

    const timestamp = new Date().getTime();
    const random = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${random}.${fileExt}`;

    const { data, error: uploadError } = await supabase.storage
      .from('car-videos')
      .upload(fileName, file, {
        cacheControl: '31536000',
        upsert: false,
        contentType: file.type,
        headers: {
          'x-admin-token': ADMIN_TOKEN
        }
      });

    if (uploadError) {
      console.error('Error uploading to storage:', uploadError);
      throw new Error(uploadError.message);
    }

    if (!data?.path) {
      throw new Error('Upload failed - no path returned');
    }

    const { data: { publicUrl } } = supabase.storage
      .from('car-videos')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error: any) {
    console.error('Error uploading video:', error);
    throw error;
  }
}