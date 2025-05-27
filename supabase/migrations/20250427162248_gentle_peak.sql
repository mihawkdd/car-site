/*
  # Add admin user and update RLS policies
  
  1. Changes
    - Create admin user with specified credentials
    - Update RLS policies to allow admin access
*/

-- Create admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'admin',
  'autoutilitareneamt@gmail.com',
  crypt('parola!anunturi', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Update RLS policies to allow admin access
DROP POLICY IF EXISTS "Admin users can modify cars" ON cars;
CREATE POLICY "Admin users can modify cars"
ON cars
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'autoutilitareneamt@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'autoutilitareneamt@gmail.com');

DROP POLICY IF EXISTS "Only admin can view inquiries" ON inquiries;
CREATE POLICY "Only admin can view inquiries"
ON inquiries
FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'email' = 'autoutilitareneamt@gmail.com');