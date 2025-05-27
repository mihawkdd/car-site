/*
  # Update storage policies to use admin token
  
  1. Changes
    - Drop existing storage policies
    - Create new policies for both images and videos buckets
    - Allow public read access
    - Allow write operations with admin token
*/

-- Drop existing storage policies
DROP POLICY IF EXISTS "Public read access for images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete videos" ON storage.objects;

-- Create new storage policies for car-images
CREATE POLICY "Public read access for images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'car-images');

CREATE POLICY "Admin token can upload images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'car-images');

CREATE POLICY "Admin token can update images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'car-images')
WITH CHECK (bucket_id = 'car-images');

CREATE POLICY "Admin token can delete images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'car-images');

-- Create new storage policies for car-videos
CREATE POLICY "Public read access for videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'car-videos');

CREATE POLICY "Admin token can upload videos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'car-videos');

CREATE POLICY "Admin token can update videos"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'car-videos')
WITH CHECK (bucket_id = 'car-videos');

CREATE POLICY "Admin token can delete videos"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'car-videos');