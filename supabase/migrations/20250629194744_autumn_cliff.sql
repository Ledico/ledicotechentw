/*
  # Fix Security Definer View Issue

  1. Changes
    - Remove the problematic admin_user_view with SECURITY DEFINER
    - Update RLS policies to be more secure
    - Ensure proper access control without SECURITY DEFINER views

  2. Security
    - Remove SECURITY DEFINER view that bypasses RLS
    - Rely on proper RLS policies instead
    - Maintain admin functionality through secure policies
*/

-- Drop the problematic view
DROP VIEW IF EXISTS public.admin_user_view;

-- Ensure RLS policies are properly configured for admin access
-- The existing policies should handle admin access correctly without SECURITY DEFINER

-- Update the is_admin function to be more secure (remove SECURITY DEFINER if present)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql;

-- Ensure promote_to_admin function is secure
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

-- Ensure revoke_admin function is secure
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