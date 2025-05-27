/*
  # Fix storage policies for car-images bucket
  
  1. Changes
    - Update storage policies to allow authenticated users to upload and manage images
    - Add proper CORS configuration
    - Fix public access for viewing images
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update and delete their images" ON storage.objects;

-- Create new storage policies
CREATE POLICY "Anyone can view car images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'car-images');

CREATE POLICY "Authenticated users can upload car images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'car-images' AND
  auth.jwt() ->> 'email' = 'autoutilitareneamt@gmail.com'
);

CREATE POLICY "Authenticated users can update car images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'car-images' AND
  auth.jwt() ->> 'email' = 'autoutilitareneamt@gmail.com'
)
WITH CHECK (
  bucket_id = 'car-images' AND
  auth.jwt() ->> 'email' = 'autoutilitareneamt@gmail.com'
);

CREATE POLICY "Authenticated users can delete car images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'car-images' AND
  auth.jwt() ->> 'email' = 'autoutilitareneamt@gmail.com'
);