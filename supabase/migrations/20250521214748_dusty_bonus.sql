/*
  # Add new car specification fields
  
  1. Changes
    - Add country of origin field
    - Add engine power field
*/

ALTER TABLE cars
ADD COLUMN IF NOT EXISTS country_of_origin text,
ADD COLUMN IF NOT EXISTS engine_power integer;