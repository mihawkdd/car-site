/*
  # Update RLS policies for cars table
  
  1. Changes
    - Remove role-based policies
    - Add simple public policies for read access
    - Add policies for write operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view cars" ON cars;
DROP POLICY IF EXISTS "Admin users can modify cars" ON cars;

-- Create new policies
CREATE POLICY "Anyone can view cars"
ON cars FOR SELECT
TO public
USING (true);

CREATE POLICY "Anyone can insert cars"
ON cars FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can update cars"
ON cars FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can delete cars"
ON cars FOR DELETE
TO public
USING (true);