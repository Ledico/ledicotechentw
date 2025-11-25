/*
  # Fix RLS Policies for Treasure Tables - Add Public Access

  This migration fixes the Row Level Security policies to allow public (unauthenticated) access
  to all treasure tables, ensuring the birthday page works for everyone without login.

  ## Changes
  - Drop existing restrictive policies
  - Create new policies that allow public read access
  - Ensure all users can view and interact with the treasure hunt
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access to photos" ON treasure_photos;
DROP POLICY IF EXISTS "Allow public read access to letters" ON treasure_letters;
DROP POLICY IF EXISTS "Allow public read access to timeline" ON treasure_timeline;
DROP POLICY IF EXISTS "Allow public read access to quiz" ON treasure_quiz;
DROP POLICY IF EXISTS "Allow public read access to gifts" ON treasure_gifts;
DROP POLICY IF EXISTS "Allow public read access to easter eggs" ON treasure_easter_eggs;
DROP POLICY IF EXISTS "Allow public read access to settings" ON treasure_settings;

-- Create new policies with proper public access
CREATE POLICY "Public can read photos"
  ON treasure_photos FOR SELECT
  USING (true);

CREATE POLICY "Public can read letters"
  ON treasure_letters FOR SELECT
  USING (true);

CREATE POLICY "Public can read timeline"
  ON treasure_timeline FOR SELECT
  USING (true);

CREATE POLICY "Public can read quiz"
  ON treasure_quiz FOR SELECT
  USING (true);

CREATE POLICY "Public can read gifts"
  ON treasure_gifts FOR SELECT
  USING (true);

CREATE POLICY "Public can read easter eggs"
  ON treasure_easter_eggs FOR SELECT
  USING (true);

CREATE POLICY "Public can read settings"
  ON treasure_settings FOR SELECT
  USING (true);

-- Update policies for interaction (allow everyone to update tracking)
DROP POLICY IF EXISTS "Allow public update to letters opened status" ON treasure_letters;
DROP POLICY IF EXISTS "Allow public update to gifts redeemed status" ON treasure_gifts;
DROP POLICY IF EXISTS "Allow public update to easter eggs found status" ON treasure_easter_eggs;

CREATE POLICY "Public can update letters"
  ON treasure_letters FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can update gifts"
  ON treasure_gifts FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can update easter eggs"
  ON treasure_easter_eggs FOR UPDATE
  USING (true)
  WITH CHECK (true);
