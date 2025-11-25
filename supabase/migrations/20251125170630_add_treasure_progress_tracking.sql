/*
  # Add Progress Tracking for Louisa's Birthday Page

  ## New Table
  
  ### `treasure_progress`
  - Tracks which steps have been completed
  - Stores completion state as JSONB
  - Single row to track overall progress
  
  ## Security
  - Public read/write access for this special gift page
*/

-- Create treasure_progress table
CREATE TABLE IF NOT EXISTS treasure_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  completed_steps jsonb NOT NULL DEFAULT '{"photos": false, "letters": false, "timeline": false, "memory": false, "quiz": false, "gifts": false}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE treasure_progress ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access
CREATE POLICY "Allow public read access to progress"
  ON treasure_progress FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to progress"
  ON treasure_progress FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update to progress"
  ON treasure_progress FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_treasure_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update timestamp
DROP TRIGGER IF EXISTS treasure_progress_updated_at ON treasure_progress;
CREATE TRIGGER treasure_progress_updated_at
  BEFORE UPDATE ON treasure_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_treasure_progress_timestamp();