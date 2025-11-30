/*
  # Add location data to treasure photos

  1. Changes
    - Add `location_name` column for display name (e.g., "Marseille, Frankreich")
    - Add `location_lat` column for latitude coordinates
    - Add `location_lng` column for longitude coordinates
    
  2. Notes
    - Existing photos will have NULL values initially
    - Can be updated manually or via SQL
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'treasure_photos' AND column_name = 'location_name'
  ) THEN
    ALTER TABLE treasure_photos ADD COLUMN location_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'treasure_photos' AND column_name = 'location_lat'
  ) THEN
    ALTER TABLE treasure_photos ADD COLUMN location_lat numeric(10, 8);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'treasure_photos' AND column_name = 'location_lng'
  ) THEN
    ALTER TABLE treasure_photos ADD COLUMN location_lng numeric(11, 8);
  END IF;
END $$;