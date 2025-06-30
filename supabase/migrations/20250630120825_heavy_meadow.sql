-- Simple SUISA setup - run this manually if migration fails

-- Add group_name column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS group_name text DEFAULT 'user';

-- Create index
CREATE INDEX IF NOT EXISTS idx_profiles_group_name ON profiles(group_name);

-- SUISA check function
CREATE OR REPLACE FUNCTION is_suisa_member()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND (group_name = 'SUISA' OR is_admin = true)
  );
END;
$$;

-- Admin functions
CREATE OR REPLACE FUNCTION assign_to_suisa(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  UPDATE profiles SET group_name = 'SUISA', updated_at = now() WHERE id = user_id;
END;
$$;

CREATE OR REPLACE FUNCTION remove_from_suisa(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  UPDATE profiles SET group_name = 'user', updated_at = now() WHERE id = user_id;
END;
$$;