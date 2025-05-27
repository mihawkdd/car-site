/*
  # Fix RLS policies for cars table

  1. Changes
    - Update RLS policy for cars table to allow admin users to modify data
    - Fix policy check conditions
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Only admin can modify cars" ON cars;

-- Create new policy with fixed conditions
CREATE POLICY "Admin users can modify cars"
ON cars
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');