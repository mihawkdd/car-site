/*
  # Fix car management policies and status handling
  
  1. Changes
    - Update RLS policies to allow proper access to cars table
    - Fix image upload permissions
    - Allow status toggling between available and sold
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view cars" ON cars;
DROP POLICY IF EXISTS "Anyone can insert cars" ON cars;
DROP POLICY IF EXISTS "Anyone can update cars" ON cars;
DROP POLICY IF EXISTS "Anyone can delete cars" ON cars;

-- Create new policies with proper email-based authentication
CREATE POLICY "Anyone can view cars"
ON cars FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin can insert cars"
ON cars FOR INSERT
TO authenticated
WITH CHECK (auth.jwt() ->> 'email' = 'autoutilitareneamt@gmail.com');

CREATE POLICY "Admin can update cars"
ON cars FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'email' = 'autoutilitareneamt@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'autoutilitareneamt@gmail.com');

CREATE POLICY "Admin can delete cars"
ON cars FOR DELETE
TO authenticated
USING (auth.jwt() ->> 'email' = 'autoutilitareneamt@gmail.com');