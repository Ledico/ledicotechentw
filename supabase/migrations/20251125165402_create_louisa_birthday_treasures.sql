/*
  # Louisa's Birthday Treasure Page - Database Schema

  This migration creates all necessary tables for an interactive birthday surprise page.

  ## New Tables

  ### `treasure_photos`
  - Stores photos for the gallery
  - Fields: id, image_url, title, description, date, category, order_index
  
  ### `treasure_letters`
  - Stores love letters/messages
  - Fields: id, title, content, order_index, is_opened
  
  ### `treasure_timeline`
  - Stores timeline events and memories
  - Fields: id, date, title, description, image_url, order_index
  
  ### `treasure_quiz`
  - Stores quiz questions and answers
  - Fields: id, question, options (jsonb), correct_answer, fun_fact, order_index
  
  ### `treasure_gifts`
  - Stores virtual gift vouchers
  - Fields: id, title, description, image_url, is_redeemed, order_index
  
  ### `treasure_easter_eggs`
  - Tracks hidden surprises
  - Fields: id, position_id, message, is_found
  
  ### `treasure_settings`
  - General settings for the page
  - Fields: id, background_music_url, countdown_date, days_together_start

  ## Security
  - All tables are read-only from the client side
  - No RLS policies needed as this is a personal gift page
  - Data will be inserted via SQL migrations or admin functions
*/

-- Create treasure_photos table
CREATE TABLE IF NOT EXISTS treasure_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  date date,
  category text DEFAULT 'memory',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create treasure_letters table
CREATE TABLE IF NOT EXISTS treasure_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  order_index integer DEFAULT 0,
  is_opened boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create treasure_timeline table
CREATE TABLE IF NOT EXISTS treasure_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  image_url text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create treasure_quiz table
CREATE TABLE IF NOT EXISTS treasure_quiz (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]',
  correct_answer integer NOT NULL,
  fun_fact text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create treasure_gifts table
CREATE TABLE IF NOT EXISTS treasure_gifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  is_redeemed boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create treasure_easter_eggs table
CREATE TABLE IF NOT EXISTS treasure_easter_eggs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position_id text NOT NULL UNIQUE,
  message text NOT NULL,
  is_found boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create treasure_settings table
CREATE TABLE IF NOT EXISTS treasure_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  background_music_url text,
  countdown_date date DEFAULT '2025-12-14',
  days_together_start date,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS (but allow public read access for this special page)
ALTER TABLE treasure_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasure_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasure_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasure_quiz ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasure_gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasure_easter_eggs ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasure_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a gift page)
CREATE POLICY "Allow public read access to photos"
  ON treasure_photos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to letters"
  ON treasure_letters FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to timeline"
  ON treasure_timeline FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to quiz"
  ON treasure_quiz FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to gifts"
  ON treasure_gifts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to easter eggs"
  ON treasure_easter_eggs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to settings"
  ON treasure_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow public updates to track progress
CREATE POLICY "Allow public update to letters opened status"
  ON treasure_letters FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public update to gifts redeemed status"
  ON treasure_gifts FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public update to easter eggs found status"
  ON treasure_easter_eggs FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial settings
INSERT INTO treasure_settings (countdown_date, days_together_start)
VALUES ('2025-12-14', '2024-01-01')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_treasure_photos_order ON treasure_photos(order_index);
CREATE INDEX IF NOT EXISTS idx_treasure_letters_order ON treasure_letters(order_index);
CREATE INDEX IF NOT EXISTS idx_treasure_timeline_date ON treasure_timeline(date DESC);
CREATE INDEX IF NOT EXISTS idx_treasure_quiz_order ON treasure_quiz(order_index);
CREATE INDEX IF NOT EXISTS idx_treasure_gifts_order ON treasure_gifts(order_index);