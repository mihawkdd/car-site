/*
  # Add admin token column and update policies
  
  1. Changes
    - Add admin_token column to cars table
    - Update RLS policies to check admin token
    - Set default policies for public access
*/

-- Add admin_token column
ALTER TABLE cars ADD COLUMN admin_token text;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view cars" ON cars;
DROP POLICY IF EXISTS "Admin can insert cars" ON cars;
DROP POLICY IF EXISTS "Admin can update cars" ON cars;
DROP POLICY IF EXISTS "Admin can delete cars" ON cars;

-- Create new policies
CREATE POLICY "Anyone can view cars"
ON cars FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin token can insert cars"
ON cars FOR INSERT
TO public
WITH CHECK (admin_token = 'nt12gcw');

CREATE POLICY "Admin token can update cars"
ON cars FOR UPDATE
TO public
USING (admin_token = 'nt12gcw')
WITH CHECK (admin_token = 'nt12gcw');

CREATE POLICY "Admin token can delete cars"
ON cars FOR DELETE
TO public
USING (admin_token = 'nt12gcw');