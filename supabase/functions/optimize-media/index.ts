import { serve } from 'https://deno.land/std@0.222.1/http/server.ts';
import Sharp from 'npm:sharp@0.33.2';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cache-Control': 'public, max-age=31536000, immutable'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { file, bucket } = await req.json();

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Download original file
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from(bucket)
      .download(file);

    if (downloadError) {
      throw new Error(`Error downloading file: ${downloadError.message}`);
    }

    const buffer = await fileData.arrayBuffer();
    const originalBuffer = new Uint8Array(buffer);

    // Process image
    if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
      const optimizedImage = await Sharp(originalBuffer)
        .webp({ quality: 80 })
        .toBuffer();

      const optimizedPath = `optimized/${file.replace(/\.[^/.]+$/, '.webp')}`;

      // Upload optimized image
      const { error: uploadError } = await supabase
        .storage
        .from(bucket)
        .upload(optimizedPath, optimizedImage, {
          contentType: 'image/webp',
          cacheControl: '31536000',
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Error uploading optimized image: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from(bucket)
        .getPublicUrl(optimizedPath);

      return new Response(
        JSON.stringify({ success: true, optimizedUrl: publicUrl }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For videos, we'll return the original URL as video processing
    // is better handled by a dedicated service
    const { data: { publicUrl } } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(file);

    return new Response(
      JSON.stringify({ success: true, originalUrl: publicUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});