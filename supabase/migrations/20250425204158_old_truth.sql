/*
  # Fix admin policy for cars table
  
  1. Changes
    - Update the admin policy to correctly check the admin role
    - Ensure proper access for admin users
    - Use auth.role() instead of jwt() for role checks
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admin users can modify cars" ON cars;
DROP POLICY IF EXISTS "Only admin can modify cars" ON cars;

-- Create new policy with correct role check
CREATE POLICY "Admin users can modify cars"
ON cars
FOR ALL
TO authenticated
USING (auth.role() = 'admin'::text)
WITH CHECK (auth.role() = 'admin'::text);