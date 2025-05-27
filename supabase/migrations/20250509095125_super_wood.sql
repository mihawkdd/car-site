/*
  # Add video support and create video storage bucket
  
  1. Changes
    - Create new storage bucket for videos
    - Update cars table to include videos column
    - Set up storage policies for video uploads
*/

-- Create videos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('car-videos', 'car-videos', true);

-- Add videos column to cars table
ALTER TABLE cars ADD COLUMN IF NOT EXISTS videos text[] DEFAULT '{}';

-- Set up storage policies for videos bucket
CREATE POLICY "Public video access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'car-videos');

CREATE POLICY "Admin video upload access"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'car-videos' AND
  auth.jwt() ->> 'email' = 'autoutilitareneamt@gmail.com'
);

CREATE POLICY "Admin video update access"
ON storage.objects FOR UPDATE
TO public
USING (
  bucket_id = 'car-videos' AND
  auth.jwt() ->> 'email' = 'autoutilitareneamt@gmail.com'
)
WITH CHECK (
  bucket_id = 'car-videos' AND
  auth.jwt() ->> 'email' = 'autoutilitareneamt@gmail.com'
);

CREATE POLICY "Admin video delete access"
ON storage.objects FOR DELETE
TO public
USING (
  bucket_id = 'car-videos' AND
  auth.jwt() ->> 'email' = 'autoutilitareneamt@gmail.com'
);