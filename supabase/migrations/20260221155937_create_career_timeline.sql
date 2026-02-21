/*
  # Create career timeline table

  1. New Tables
    - `career_timeline`
      - `id` (uuid, primary key)
      - `title` (text) - Job title or role name
      - `company` (text) - Company or institution name
      - `description` (text) - Description of the role/position
      - `start_date` (date) - When the position started
      - `end_date` (date, nullable) - When it ended, null = current position
      - `type` (text) - Type of entry: education, work, milestone
      - `icon` (text, nullable) - Optional icon name from lucide-react
      - `skills` (text array) - Related skills/technologies
      - `order_index` (integer) - For custom ordering
      - `is_visible` (boolean) - Whether to show on the public page
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `career_timeline` table
    - Public read access for visible entries (portfolio display)
    - Only admins can insert, update, delete
*/

CREATE TABLE IF NOT EXISTS career_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  description text DEFAULT '',
  start_date date NOT NULL,
  end_date date,
  type text NOT NULL DEFAULT 'work' CHECK (type IN ('education', 'work', 'milestone')),
  icon text,
  skills text[] DEFAULT '{}'::text[],
  order_index integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE career_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible timeline entries"
  ON career_timeline
  FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Admins can insert timeline entries"
  ON career_timeline
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update timeline entries"
  ON career_timeline
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete timeline entries"
  ON career_timeline
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE TRIGGER update_career_timeline_updated_at
  BEFORE UPDATE ON career_timeline
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
