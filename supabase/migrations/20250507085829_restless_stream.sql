/*
  # Fix storage policies for car-images bucket
  
  1. Changes
    - Update storage policies to allow admin to upload images
    - Fix public folder access
*/

-- Drop existing storage policies
DROP POLICY IF EXISTS "Anyone can view car images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload car images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update car images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete car images" ON storage.objects;

-- Create new storage policies
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'car-images');

CREATE POLICY "Admin upload access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'car-images' AND
  auth.jwt() ->> 'email' = 'autoutilitareneamt@gmail.com'
);

CREATE POLICY "Admin update access"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'car-images' AND
  auth.jwt() ->> 'email' = 'autoutilitareneamt@gmail.com'
);

CREATE POLICY "Admin delete access"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'car-images' AND
  auth.jwt() ->> 'email' = 'autoutilitareneamt@gmail.com'
);