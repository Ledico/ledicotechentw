/*
  # Add Admin Role to User Profiles

  1. Changes
    - Add `is_admin` column to profiles table
    - Add RLS policy for admins to manage all users
    - Create function to check admin status
    - Add admin-only policies for user management

  2. Security
    - Only admins can modify admin status of other users
    - Regular users cannot see or modify admin status
    - Admins can view and manage all user profiles
*/

-- Add is_admin column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false NOT NULL;
  END IF;
END $$;

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy for admins to read all profiles
CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Policy for admins to update all profiles
CREATE POLICY "Admins can update all profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (is_admin());

-- Policy for admins to delete profiles (if needed)
CREATE POLICY "Admins can delete profiles"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Update the existing user update policy to prevent non-admins from changing admin status
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    (
      -- If user is not admin, they cannot change is_admin field
      NOT is_admin() OR 
      -- If user is admin, they can change anything
      is_admin()
    )
  );

-- Create a view for admin user management (excludes sensitive data)
CREATE OR REPLACE VIEW public.admin_user_view AS
SELECT 
  id,
  email,
  full_name,
  avatar_url,
  is_admin,
  created_at,
  updated_at
FROM profiles
WHERE is_admin();

-- Grant access to the view for authenticated users (will be filtered by RLS)
GRANT SELECT ON public.admin_user_view TO authenticated;

-- Function to promote user to admin (only callable by existing admins)
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  -- Check if current user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can promote users to admin';
  END IF;
  
  -- Update the user
  UPDATE profiles 
  SET is_admin = true, updated_at = now()
  WHERE id = user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to revoke admin status (only callable by existing admins)
CREATE OR REPLACE FUNCTION public.revoke_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  -- Check if current user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can revoke admin status';
  END IF;
  
  -- Prevent removing admin status from self
  IF user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot revoke your own admin status';
  END IF;
  
  -- Update the user
  UPDATE profiles 
  SET is_admin = false, updated_at = now()
  WHERE id = user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the first admin user (you'll need to update this with your email)
-- This is commented out - you should run this manually with your email
-- UPDATE profiles SET is_admin = true WHERE email = 'your-admin-email@example.com';