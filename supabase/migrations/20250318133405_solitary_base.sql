/*
  # Initial Schema Setup for Luxury Car Sales Platform

  1. New Tables
    - `cars`
      - `id` (uuid, primary key)
      - `title` (text) - Car title/name
      - `description` (text) - Detailed description
      - `price` (integer) - Price in cents
      - `year` (integer) - Manufacturing year
      - `mileage` (integer) - Current mileage
      - `images` (text[]) - Array of image URLs
      - `specs` (jsonb) - Detailed specifications
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `inquiries`
      - `id` (uuid, primary key)
      - `car_id` (uuid, foreign key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `message` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Cars table:
      - Anyone can read
      - Only authenticated admin can insert/update/delete
    - Inquiries table:
      - Anyone can insert
      - Only authenticated admin can read/update/delete
*/

-- Create cars table
CREATE TABLE cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price integer NOT NULL,
  year integer NOT NULL,
  mileage integer NOT NULL,
  images text[] NOT NULL DEFAULT '{}',
  specs jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create inquiries table
CREATE TABLE inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid REFERENCES cars(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Cars policies
CREATE POLICY "Anyone can view cars"
  ON cars
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admin can modify cars"
  ON cars
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin')
  WITH CHECK (auth.role() = 'admin');

-- Inquiries policies
CREATE POLICY "Anyone can create inquiries"
  ON inquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Only admin can view inquiries"
  ON inquiries
  FOR SELECT
  TO authenticated
  USING (auth.role() = 'admin');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at
CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();