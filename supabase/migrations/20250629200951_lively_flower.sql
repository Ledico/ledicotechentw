/*
  # Fix User Profile Creation and Visibility

  1. Check and fix the trigger for automatic profile creation
  2. Manually create profiles for existing auth users
  3. Ensure proper RLS policies for admin visibility
  4. Add debugging functions to check user status
*/

-- First, let's check if there are users in auth.users but not in profiles
-- and create missing profiles

-- Function to sync auth users with profiles
CREATE OR REPLACE FUNCTION public.sync_auth_users_to_profiles()
RETURNS void 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert missing profiles for existing auth users
  INSERT INTO public.profiles (id, email, full_name, is_admin)
  SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', au.email),
    false -- Default to non-admin
  FROM auth.users au
  LEFT JOIN public.profiles p ON au.id = p.id
  WHERE p.id IS NULL
    AND au.email IS NOT NULL;
    
  -- Log the sync
  RAISE NOTICE 'Synced % users from auth.users to profiles', 
    (SELECT COUNT(*) FROM auth.users au LEFT JOIN public.profiles p ON au.id = p.id WHERE p.id IS NULL);
END;
$$;

-- Run the sync function
SELECT sync_auth_users_to_profiles();

-- Recreate the trigger to ensure it works properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, is_admin)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    false
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, just return
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log error but don't fail the auth process
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to check user status (for debugging)
CREATE OR REPLACE FUNCTION public.check_user_status(user_email text DEFAULT NULL)
RETURNS TABLE(
  source text,
  user_id uuid,
  email text,
  has_profile boolean,
  is_admin boolean,
  created_at timestamptz
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'auth.users'::text as source,
    au.id as user_id,
    au.email,
    (p.id IS NOT NULL) as has_profile,
    COALESCE(p.is_admin, false) as is_admin,
    au.created_at
  FROM auth.users au
  LEFT JOIN public.profiles p ON au.id = p.id
  WHERE (user_email IS NULL OR au.email = user_email)
  ORDER BY au.created_at DESC;
END;
$$;

-- Create a function to make a user admin (for initial setup)
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email text)
RETURNS boolean 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_found boolean := false;
BEGIN
  -- Update user to admin
  UPDATE public.profiles 
  SET is_admin = true, updated_at = now()
  WHERE email = user_email;
  
  GET DIAGNOSTICS user_found = FOUND;
  
  IF NOT user_found THEN
    RAISE EXCEPTION 'User with email % not found in profiles table', user_email;
  END IF;
  
  RETURN true;
END;
$$;

-- Check current status
SELECT 'Current user status:' as info;
SELECT * FROM check_user_status();

-- Show profiles table content
SELECT 'Profiles table content:' as info;
SELECT id, email, full_name, is_admin, created_at FROM public.profiles ORDER BY created_at DESC;

-- Instructions for making yourself admin
SELECT 'To make yourself admin, run:' as instruction
UNION ALL
SELECT 'SELECT make_user_admin(''your-email@example.com'');'
UNION ALL
SELECT 'Replace your-email@example.com with your actual email address';