/*
  # Create storage bucket for car images

  1. New Storage Bucket
    - Create a new bucket called 'car-images' for storing vehicle images
    - Enable public access to the bucket
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('car-images', 'car-images', true);

-- Set up security policies for the bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
TO public 
USING ( bucket_id = 'car-images' );

CREATE POLICY "Authenticated users can upload images" 
ON storage.objects FOR INSERT 
TO public 
WITH CHECK ( bucket_id = 'car-images' );

CREATE POLICY "Authenticated users can update and delete their images" 
ON storage.objects FOR ALL 
TO public
USING ( bucket_id = 'car-images' )
WITH CHECK ( bucket_id = 'car-images' );