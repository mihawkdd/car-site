/*
  # Add status column and update schema

  1. Changes
    - Add status column to cars table
    - Add default value for status
    - Update existing rows
*/

ALTER TABLE cars ADD COLUMN IF NOT EXISTS status text DEFAULT 'available';