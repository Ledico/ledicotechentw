/*
  # Add Missing Profile Columns

  1. Changes
    - Add group_name column to profiles table (used for SUISA membership check)
    
  2. Security
    - Maintains existing RLS policies
*/

-- Add group_name column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' 
      AND table_schema = 'public' 
      AND column_name = 'group_name'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN group_name text;
  END IF;
END $$;