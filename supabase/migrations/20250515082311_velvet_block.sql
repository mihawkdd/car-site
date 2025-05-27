/*
  # Add optimized storage buckets and policies
  
  1. Changes
    - Create new storage buckets for optimized media
    - Set up storage policies for optimized content
    - Add cache control headers
*/

-- Create optimized storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('car-images-optimized', 'car-images-optimized', true),
  ('car-videos-optimized', 'car-videos-optimized', true);

-- Set up storage policies for optimized buckets
CREATE POLICY "Public read access for optimized images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'car-images-optimized');

CREATE POLICY "Edge function can write optimized images"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'car-images-optimized');

CREATE POLICY "Public read access for optimized videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'car-videos-optimized');

CREATE POLICY "Edge function can write optimized videos"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'car-videos-optimized');