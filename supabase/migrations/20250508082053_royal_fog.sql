/*
  # Make storage completely public and fix policies
  
  1. Changes
    - Make storage bucket completely public
    - Allow anonymous uploads
    - Remove all restrictions
*/

-- Drop existing storage policies
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload access" ON storage.objects;
DROP POLICY IF EXISTS "Admin update access" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete access" ON storage.objects;

-- Create new public policies
CREATE POLICY "Public access"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'car-images')
WITH CHECK (bucket_id = 'car-images');